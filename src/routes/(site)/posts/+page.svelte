<script lang="ts">
  import { onMount } from 'svelte';
  import { format } from 'date-fns';
  import Card from '$lib/components/common/Card.svelte';

  interface Post {
    id: string;
    title: string;
    date: string;
    lead: string;
    content: Array<{ tag: string; content: string; classes?: string }>;
    tags: string[];
  }

  let allPosts: Post[] = [];
  let currentPage = 1;
  const postsPerPage = 5;

  $: totalPages = Math.ceil(allPosts.length / postsPerPage);
  $: startIndex = (currentPage - 1) * postsPerPage;
  $: endIndex = startIndex + postsPerPage;
  $: posts = allPosts.slice(startIndex, endIndex);
  $: hasNext = currentPage < totalPages;
  $: hasPrevious = currentPage > 1;

  onMount(async () => {
    try {
      const response = await fetch('/posts.json');
      allPosts = await response.json();
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

<div class="container mx-auto px-4 py-8">
  <h1 class="text-4xl font-bold mb-8 text-center">Posts</h1>

  {#if allPosts.length === 0}
    <div class="text-center">
      <p class="text-lg text-secondary">Loading posts...</p>
    </div>
  {:else}
    <div class="max-w-4xl mx-auto">
      <!-- Posts List -->
      <div class="space-y-6 mb-8">
        {#each posts as post}
          <Card
            href="/posts/{post.id}"
            className="bg-[color-mix(in_srgb,var(--nord-black)_40%,transparent)] transition-transform duration-200 hover:-translate-y-1"
          >
            <h2 class="text-2xl font-semibold mb-2">
              {post.title}
            </h2>
            <p class="mb-3">{post.lead}</p>
            <div class="flex justify-between items-center text-sm">
              <time>{format(new Date(post.date), 'MMMM d, yyyy')}</time>
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
