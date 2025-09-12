<script lang="ts">
  const currentYear = new Date().getFullYear();
</script>

<footer
  class="footer text-center py-4 overflow-hidden transition-all duration-300"
  style="color: var(--text-subtle);"
>
  <div class="relative inline-block">
    <div class="footer-collapsed flex justify-center items-center transition-all duration-300">
      <span class="text-lg">©</span>
    </div>
    <div
      class="footer-expanded absolute top-0 left-1/2 transform -translate-x-1/2 opacity-0 -translate-y-2.5 transition-all duration-300 whitespace-nowrap"
    >
      <p class="text-sm">
        © Moyewa Odiase {currentYear} - Built using Svelte
        <img src="/assets/images/svelte.svg" alt="Svelte" class="inline w-4 h-4 ml-1 svelte-logo" />
      </p>
    </div>
  </div>
</footer>

<style>
  .footer:hover .footer-collapsed {
    opacity: 0;
    transform: translateY(10px);
  }

  .footer:hover .footer-expanded {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  .svelte-logo {
    filter: grayscale(100%) brightness(0.8) contrast(1.2);
    opacity: 0.7;
  }
</style>
