import { error } from '@sveltejs/kit';
import type { PageLoad, EntryGenerator } from './$types';

export const prerender = true;

interface Post {
  id: string;
  title: string;
  date: string;
  lead: string;
  content: Array<{ tag: string; content: string; classes?: string; language?: string }>;
  tags: string[];
}

export const load: PageLoad = async ({ params, fetch }) => {
  try {
    const response = await fetch('/posts.json');
    const posts: Post[] = await response.json();
    const post = posts.find((p) => p.id === params.id);

    if (!post) {
      throw error(404, 'Post not found');
    }

    return {
      post,
    };
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err && err.status === 404) {
      throw err;
    }
    throw error(500, 'Failed to load post');
  }
};

export const entries: EntryGenerator = async ({
  fetch,
}: { fetch?: typeof globalThis.fetch } = {}) => {
  if (!fetch) {
    return [{ id: '01K5E3T0H913588MW7P3ZTYN85' }];
  }

  const response = await fetch('/posts.json');
  const posts: Post[] = await response.json();
  return posts.map((post) => ({
    id: post.id,
  }));
};
