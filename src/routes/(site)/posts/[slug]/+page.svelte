<script lang="ts">
  import { goto } from '$app/navigation';
  import { format } from 'date-fns';
  import { enGB } from 'date-fns/locale';
  import MarkdownArticle from '$lib/components/common/MarkdownArticle.svelte';
  import type { Post } from '$lib/types';

  interface PageData {
    post: Post;
  }

  export let data: PageData;

  const { post } = data;
</script>

{#if post}
  <div class="max-w-4xl mx-auto">
    <!-- Back button -->
    <button
      on:click={() => goto('/posts')}
      class="mb-6 flex items-center gap-2 text-contrast hover:text-secondary transition-colors duration-500"
    >
      ← Back to Posts
    </button>

    <!-- Post header -->
    <header class="mb-8">
      <h1 class="text-4xl font-bold mb-4">{post.title}</h1>
      <p class="text-md mb-4">{post.lead}</p>
      <div class="flex justify-between items-center text-sm mb-6">
        <time>{format(new Date(post.date), 'd MMMM yyyy', { locale: enGB })}</time>
        <div class="flex gap-2">
          {#each post.tags as tag}
            <span class="px-2 py-1 rounded text-xs">{tag}</span>
          {/each}
        </div>
      </div>
      <hr />
    </header>

    <!-- Post content -->
    <article>
      <MarkdownArticle content={post.content} />
    </article>
  </div>
{/if}
