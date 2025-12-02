import type { ContentBlock, ContentBlockType, Post } from '$lib/types';
import type { Observable } from 'rxjs';
import { from } from 'rxjs';
import { timeout, catchError, map } from 'rxjs/operators';
import { retryWithBackoff } from './rxjs';

export const CONTENT_BLOCK_TYPES = [
  { tag: 'markdown', label: 'Markdown' },
  { tag: 'code', label: 'Code' },
  { tag: 'aside', label: 'Aside' },
] as const;

interface AddContentBlockRequest {
  tag: ContentBlockType;
  content: string;
  language?: string;
  position: 'before' | 'after';
  targetBlockId?: string;
}

interface CreatePostRequest {
  title: string;
  lead: string;
  tags: string[];
}

function fetchJson<T>(url: string, options?: RequestInit): Observable<T> {
  return from(
    fetch(url, options).then(async (response) => {
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
          url,
        });

        let errorBody;
        try {
          errorBody = JSON.parse(errorText);
        } catch {
          errorBody = { error: `Failed request: ${response.status} ${response.statusText}` };
        }

        throw errorBody;
      }
      return response.json();
    })
  ).pipe(
    timeout(10000),
    retryWithBackoff(3, 1000),
    catchError((error) => {
      console.error('Network/Request Error:', error);
      throw error;
    })
  );
}

export function updateContentBlock(
  postId: string,
  blockId: string,
  content: string
): Observable<ContentBlock> {
  return fetchJson<{ block: ContentBlock }>(`/api/posts/${postId}/content/${blockId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  }).pipe(map((result) => result.block));
}

export function deleteContentBlock(postId: string, blockId: string): Observable<void> {
  return from(
    fetch(`/api/posts/${postId}/content/${blockId}`, { method: 'DELETE' }).then(
      async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
            url: `/api/posts/${postId}/content/${blockId}`,
          });

          let errorBody;
          try {
            errorBody = JSON.parse(errorText);
          } catch {
            errorBody = { error: `Failed to delete: ${response.status} ${response.statusText}` };
          }

          throw errorBody;
        }
      }
    )
  ).pipe(
    timeout(10000),
    retryWithBackoff(2, 1000),
    catchError((error) => {
      console.error('Network/Request Error:', error);
      throw error;
    })
  );
}

export function addContentBlock(
  postId: string,
  request: AddContentBlockRequest
): Observable<ContentBlock> {
  return fetchJson<{ block: ContentBlock }>(`/api/posts/${postId}/content`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  }).pipe(map((result) => result.block));
}

export function moveContentBlock(
  postId: string,
  blockId: string,
  direction: 'up' | 'down'
): Observable<ContentBlock> {
  return fetchJson<{ block: ContentBlock }>(`/api/posts/${postId}/content/${blockId}/move`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ direction }),
  }).pipe(map((result) => result.block));
}

export function createPost(request: CreatePostRequest): Observable<Post> {
  return fetchJson<{ post: Post }>('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  }).pipe(map((result) => result.post));
}

export function publishPost(postId: string): Observable<Post> {
  return fetchJson<{ post: Post }>(`/api/posts/${postId}/publish`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  }).pipe(map((result) => result.post));
}
