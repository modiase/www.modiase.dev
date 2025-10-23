<script lang="ts">
  import { goto } from '$app/navigation';
  import { format } from 'date-fns';
  import { enGB } from 'date-fns/locale';
  import MarkdownArticle from '$lib/components/common/MarkdownArticle.svelte';
  import { toast } from 'svelte-french-toast';
  import { onMount } from 'svelte';
  import clsx from 'clsx';
  import type { Post } from '$lib/types';
  import { createSubscriptionManager } from '$lib/utils/rxjs';
  import {
    hasPendingChanges$,
    pendingChangesCount$,
    commitAllChanges,
    clearAll,
  } from '$lib/stores/pendingChanges';

  export let post: Post;
  export let isEditMode: boolean = false;

  let hasPendingChanges = false;
  let pendingChangesCount = 0;
  let isSaving = false;

  const addSubscription = createSubscriptionManager();

  onMount(() => {
    if (isEditMode) {
      clearAll();
    }
    addSubscription(hasPendingChanges$.subscribe((val) => (hasPendingChanges = val)));
    addSubscription(pendingChangesCount$.subscribe((val) => (pendingChangesCount = val)));
  });

  function saveAll() {
    if (isSaving || !hasPendingChanges) return;

    isSaving = true;
    addSubscription(
      commitAllChanges(post.id).subscribe({
        error: (error) => {
          console.error('Failed to save changes:', error);
          toast.error('Failed to save changes. Please try again.');
          isSaving = false;
        },
      })
    );
  }
</script>

<svelte:head>
  <meta name="description" content={post.lead} />
</svelte:head>

{#if post}
  <div class="max-w-4xl mx-auto">
    {#if import.meta.env.DEV}
      {#if isEditMode && hasPendingChanges}
        <button
          class={clsx(
            'fixed top-4 right-20 z-50 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:brightness-90 transition-colors',
            { 'opacity-50 cursor-not-allowed': isSaving }
          )}
          on:click={saveAll}
          disabled={isSaving}
          title="Save all pending changes"
        >
          <div class="relative">
            <img src="/assets/icons/database.svg" alt="Save all" class="w-6 h-6" />
            {#if pendingChangesCount > 0}
              <span
                class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
              >
                {pendingChangesCount}
              </span>
            {/if}
          </div>
        </button>
      {/if}

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
    {/if}

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
      <MarkdownArticle content={post.content} title={post.title} {isEditMode} postId={post.id} />
    </article>
  </div>
{/if}
