<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  let error: any;

  onMount(() => {
    error = $page.error;
  });
</script>

<main>
  <div class="error-container">
    <h1>Oops!</h1>
    <p>Something went wrong.</p>
    {#if error}
      <p class="error-message">{error.message}</p>
    {/if}
    <a href="/">Go home</a>
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

  .error-message {
    color: #ff6b6b;
    margin: 1rem 0;
  }

  a {
    color: #4ecdc4;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border: 1px solid #4ecdc4;
    border-radius: 4px;
    transition: all 0.3s ease;
  }

  a:hover {
    background-color: #4ecdc4;
    color: white;
  }
</style>
