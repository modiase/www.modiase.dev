<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';

  let error: unknown;
  let errorMessage: string = 'Something went wrong';

  onMount(() => {
    error = $page.error;
    if (
      typeof window !== 'undefined' &&
      (window as unknown as Record<string, unknown>).__sveltekit_404_fallback
    ) {
      errorMessage = 'Page Not Found';
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String(error.message);
    }
  });
</script>

<main>
  <ErrorDisplay message={errorMessage} />
</main>
