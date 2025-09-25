import { error } from '@sveltejs/kit';
import type { PageLoad, EntryGenerator } from './$types';
import type { Post } from '$lib/types';

export const prerender = true;

export const load: PageLoad = async ({ params, fetch }) => {
  try {
    const response = await fetch('/posts.json');
    const posts: Post[] = await response.json();
    const post = posts.find((p) => p.slug === params.slug);

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
    return [{ slug: 'feeling-machines' }];
  }

  const response = await fetch('/posts.json');
  const posts: Post[] = await response.json();
  return posts.map((post) => ({
    slug: post.slug,
  }));
};
