import type { ContentBlock } from '$lib/types';
import { Observable, from } from 'rxjs';
import { timeout, catchError, map } from 'rxjs/operators';
import { retryWithBackoff } from './rxjs';

interface AddContentBlockRequest {
  type: 'markdown' | 'code' | 'aside';
  content: string;
  language?: string;
  position: 'before' | 'after';
  targetBlockId: string;
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
        throw new Error(`Failed request: ${response.status} ${response.statusText} - ${errorText}`);
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
          throw new Error(
            `Failed to delete: ${response.status} ${response.statusText} - ${errorText}`
          );
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
