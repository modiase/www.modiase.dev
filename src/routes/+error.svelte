<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import Link from '$lib/components/Link.svelte';

  let error: any;

  onMount(() => {
    error = $page.error;
  });
</script>

<main>
  <div class="error-container">
    <p class="text-6xl mb-2 animate-bounce">⚠️</p>
    <p>Something went wrong.</p>
    {#if error}
      <p>{error.message}</p>
    {/if}
    <div class="mt-4">
      <Link href="/" class="link ">Go Home</Link>
    </div>
  </div>
</main>

<style>
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
  }
</style>
