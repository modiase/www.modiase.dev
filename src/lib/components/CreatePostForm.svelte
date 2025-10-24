<script lang="ts">
  import { BehaviorSubject } from 'rxjs';
  import { toast } from 'svelte-french-toast';
  import { goto } from '$app/navigation';
  import SimpleForm from '$lib/components/common/SimpleForm.svelte';
  import type { FieldConfig } from '$lib/types/form';
  import { createPost } from '$lib/utils/api';
  import { createSubscriptionManager } from '$lib/utils/rxjs';
  import { type Post } from '$lib/types';

  export let onClose: () => void;

  const title$ = new BehaviorSubject<string>('');
  const lead$ = new BehaviorSubject<string>('');
  const tags$ = new BehaviorSubject<string>('');

  const addSubscription = createSubscriptionManager();

  let title = '';
  let lead = '';
  let tags = '';

  $: fields = [
    {
      label: 'Title',
      value: title,
      onChange: (val: string) => {
        title = val;
        title$.next(val);
      },
      type: 'text' as const,
    },
    {
      label: 'Lead',
      value: lead,
      onChange: (val: string) => {
        lead = val;
        lead$.next(val);
      },
      type: 'textarea' as const,
    },
    {
      label: 'Tags (space-separated)',
      value: tags,
      onChange: (val: string) => {
        tags = val;
        tags$.next(val);
      },
      type: 'text' as const,
    },
  ] satisfies FieldConfig[];

  function handleSubmit() {
    const titleVal = title$.value.trim();
    const leadVal = lead$.value.trim();
    const tagsVal = tags$.value
      .trim()
      .split(/\s+/)
      .filter((t) => t.length > 0);

    if (!titleVal) {
      toast.error('Title is required');
      return;
    }

    if (!leadVal) {
      toast.error('Lead is required');
      return;
    }

    addSubscription(
      createPost({ title: titleVal, lead: leadVal, tags: tagsVal }).subscribe({
        next: (post: Post) => {
          toast.success('Post created successfully');
          onClose();
          goto(`/posts/${post.slug}/edit`);
        },
        error: (error: unknown) => {
          console.error('Failed to create post:', error);
          toast.error('Failed to create post. Please try again.');
        },
      })
    );
  }
</script>

<div>
  <h2 class="text-2xl font-bold mb-6">Create New Post</h2>
  <SimpleForm {fields} onSubmit={handleSubmit} submitLabel="Create Post" />
</div>
