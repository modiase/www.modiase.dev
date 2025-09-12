<script lang="ts">
  const currentYear = new Date().getFullYear();
</script>

<footer class="text-center text-sm py-4" style="color: var(--text-subtle);">
  <p>
    Moyewa Odiase © {currentYear} - Built using Svelte
    <img src="/assets/images/svelte.svg" alt="Svelte" class="inline w-4 h-4 ml-1 svelte-logo" />
  </p>
</footer>

<style>
  .svelte-logo {
    filter: grayscale(100%) brightness(0.8) contrast(1.2);
    opacity: 0.7;
  }
</style>
