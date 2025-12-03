<script lang="ts">
  import { onMount } from 'svelte';
  import { format } from 'date-fns';
  import { enGB } from 'date-fns/locale';
  import Card from '$lib/components/common/Card.svelte';
  import Modal from '$lib/components/common/Modal.svelte';
  import CreatePostForm from '$lib/components/CreatePostForm.svelte';
  import clsx from 'clsx';
  import type { Post } from '$lib/types';

  let allPosts: Post[] = [];
  let currentPage = 1;
  const postsPerPage = 5;
  let showModal = false;

  $: totalPages = Math.ceil(allPosts.length / postsPerPage);
  $: startIndex = (currentPage - 1) * postsPerPage;
  $: endIndex = startIndex + postsPerPage;
  $: posts = allPosts.slice(startIndex, endIndex);
  $: hasNext = currentPage < totalPages;
  $: hasPrevious = currentPage > 1;

  onMount(async () => {
    try {
      const response = await fetch('/posts.json');
      let posts = await response.json();

      // Filter out hidden posts in production
      if (!import.meta.env.DEV) {
        posts = posts.filter((post: Post) => !post.hidden);
      }

      allPosts = posts;
      allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  });

  function goToNextPage() {
    if (hasNext) {
      currentPage++;
    }
  }

  function goToPreviousPage() {
    if (hasPrevious) {
      currentPage--;
    }
  }
</script>

<svelte:head>
  <title>Posts | modiase.dev</title>
  <meta name="description" content="Some thoughts on various topics" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-4xl font-bold mb-8 text-center">Posts</h1>

  {#if import.meta.env.DEV}
    <button
      class={clsx(
        'fixed top-4 right-4 z-50 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:brightness-90 transition-colors'
      )}
      on:click={() => (showModal = true)}
    >
      <img src="/assets/icons/plus.svg" alt="Add new post" class="w-6 h-6" />
    </button>
  {/if}

  {#if allPosts.length === 0}
    <div class="text-center">
      <p class="text-lg text-secondary">Loading posts...</p>
    </div>
  {:else}
    <div class="max-w-full sm:max-w-[1200px] mx-auto">
      <!-- Posts List -->
      <div class="space-y-6 mb-8">
        {#each posts as post}
          <Card
            href="/posts/{post.slug}"
            bgClassName={post.hidden && import.meta.env.DEV
              ? 'bg-subtle'
              : 'bg-surface-transparent-alt-40'}
            className="transition-transform duration-200 hover:-translate-y-1"
          >
            <h2 class="text-2xl font-semibold mb-2">
              {post.title}
            </h2>
            <p class="mb-3">{post.lead}</p>
            <div class="flex justify-between items-center text-sm">
              <time>{format(new Date(post.date), 'd MMMM yyyy', { locale: enGB })}</time>
              <div class="flex gap-2">
                {#each post.tags as tag}
                  <span class="px-2 py-1 rounded text-xs">{tag}</span>
                {/each}
              </div>
            </div>
          </Card>
        {/each}
      </div>

      <!-- Pagination Controls -->
      <div class="flex justify-between items-center">
        <button
          on:click={goToPreviousPage}
          disabled={!hasPrevious}
          class="px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>

        <span class="text-sm">
          Page {currentPage} of {totalPages}
        </span>

        <button
          on:click={goToNextPage}
          disabled={!hasNext}
          class="px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </div>
  {/if}
</div>

<Modal isOpen={showModal} onClose={() => (showModal = false)}>
  <CreatePostForm onClose={() => (showModal = false)} />
</Modal>
