<script lang="ts">
  import clsx from 'clsx';

  const currentYear = new Date().getFullYear();
  let isHovered = false;
</script>

<footer
  class="footer text-center py-4 transition-all duration-300 flex justify-center items-center font-medium text-text-muted"
  on:mouseenter={() => (isHovered = true)}
  on:mouseleave={() => (isHovered = false)}
>
  <span
    class={clsx(
      'footer-full inline whitespace-nowrap overflow-hidden transition-all duration-500 text-subtle text-sm',
      {
        'w-0': !isHovered,
        'w-[200px]': isHovered,
      }
    )}
    >Moyewa Odiase - {currentYear}
  </span>
  <i class="fas fa-copyright text-subtle copyleft text-sm"></i>
</footer>

<style>
  .svelte-logo {
    filter: grayscale(100%) brightness(0.4) contrast(0.8);
  }

  .copyleft {
    transform: scaleX(-1);
  }
</style>
