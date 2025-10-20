<script lang="ts">
  import { goto } from '$app/navigation';
  import { format } from 'date-fns';
  import { enGB } from 'date-fns/locale';
  import MarkdownArticle from '$lib/components/common/MarkdownArticle.svelte';
  import clsx from 'clsx';
  import type { Post } from '$lib/types';

  interface Props {
    post: Post;
    isEditMode?: boolean;
  }

  export let post: Post;
  export let isEditMode: boolean = false;
</script>

<svelte:head>
  <meta name="description" content={post.lead} />
</svelte:head>

{#if post}
  <div class="max-w-4xl mx-auto">
    <button
      class={clsx(
        'fixed top-4 right-4 z-50 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:brightness-90 transition-colors'
      )}
      on:click={() => goto(isEditMode ? `/posts/${post.slug}` : `/posts/${post.slug}/edit`)}
    >
      <img
        src={isEditMode ? '/assets/icons/eye.svg' : '/assets/icons/pencil.svg'}
        alt={isEditMode ? 'View post' : 'Edit post'}
        class="w-6 h-6"
      />
    </button>

    <button
      on:click={() => goto('/posts')}
      class="mb-6 flex items-center gap-2 text-contrast hover:text-secondary transition-colors duration-500"
    >
      ← Back to Posts
    </button>

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

    <article>
      <MarkdownArticle content={post.content} title={post.title} {isEditMode} />
    </article>
  </div>
{/if}
