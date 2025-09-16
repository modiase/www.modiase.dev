import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  try {
    const posts = await import('../_posts.json');
    const post = posts.default.find((p) => p.id === params.id);

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
}
