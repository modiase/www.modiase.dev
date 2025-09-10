<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';

  let error: any;
  let errorMessage: string = 'Something went wrong';

  onMount(() => {
    error = $page.error;
    if (error) {
      errorMessage = error.message;
    }
  });
</script>

<main>
  <ErrorDisplay message={errorMessage} />
</main>
