<script lang="ts">
  export let message: string = 'Something went wrong';
  export let showHomeLink: boolean = true;
  export let homeHref: string = '/';
</script>

<div class="error-container">
  <p class="text-6xl mb-2 animate-bounce">⚠️</p>
  <p class="font-semibold">{message}</p>
  {#if showHomeLink}
    <div class="mt-4">
      <a href={homeHref} class="link">Go Home</a>
    </div>
  {/if}
</div>

<style>
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
  }

  .link {
    text-decoration: none;
    color: var(--text-contrast);
  }

  .link:hover {
    color: var(--text-secondary);
  }
</style>
