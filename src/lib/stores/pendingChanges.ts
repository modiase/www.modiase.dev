import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { forkJoin, of, concat } from 'rxjs';
import { updateContentBlock, deleteContentBlock } from '$lib/utils/api';
import { toast } from 'svelte-french-toast';

export type PendingEditChange = {
  type: 'edit';
  blockId: string;
  content: string;
  originalContent: string;
};

export type PendingDeleteChange = {
  type: 'delete';
  blockId: string;
};

export type PendingChange = PendingEditChange | PendingDeleteChange;

const pendingChangesMap$ = new BehaviorSubject<Map<string, PendingChange>>(new Map());

export const pendingChanges$ = pendingChangesMap$.asObservable();

export const hasPendingChanges$ = pendingChanges$.pipe(map((changes) => changes.size > 0));

export const pendingChangesCount$ = pendingChanges$.pipe(map((changes) => changes.size));

export function addEdit(blockId: string, content: string, originalContent: string) {
  const current = new Map(pendingChangesMap$.value);
  current.set(blockId, { type: 'edit', blockId, content, originalContent });
  pendingChangesMap$.next(current);
}

export function addDelete(blockId: string) {
  const current = new Map(pendingChangesMap$.value);
  current.set(blockId, { type: 'delete', blockId });
  pendingChangesMap$.next(current);
}

export function removeChange(key: string) {
  const current = new Map(pendingChangesMap$.value);
  current.delete(key);
  pendingChangesMap$.next(current);
}

export function clearAll() {
  pendingChangesMap$.next(new Map());
}

export function hasChange(key: string): boolean {
  return pendingChangesMap$.value.has(key);
}

export function getChange(key: string): PendingChange | undefined {
  return pendingChangesMap$.value.get(key);
}

export function commitAllChanges(postId: string) {
  const changes = Array.from(pendingChangesMap$.value.values());

  if (changes.length === 0) {
    return of(null);
  }

  const edits = changes.filter((c): c is PendingEditChange => c.type === 'edit');
  const deletes = changes.filter((c): c is PendingDeleteChange => c.type === 'delete');

  const operations = [];

  if (edits.length > 0) {
    operations.push(
      forkJoin(edits.map((change) => updateContentBlock(postId, change.blockId, change.content)))
    );
  }

  if (deletes.length > 0) {
    operations.push(forkJoin(deletes.map((change) => deleteContentBlock(postId, change.blockId))));
  }

  if (operations.length === 0) {
    return of(null);
  }

  return concat(...operations).pipe(
    map(() => {
      const totalChanges = changes.length;
      toast.success(`Successfully saved ${totalChanges} change${totalChanges > 1 ? 's' : ''}`);
      clearAll();
      window.location.reload();
      return null;
    })
  );
}
