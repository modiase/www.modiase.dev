<script lang="ts">
  import '$styles/app.scss';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import CopyFooter from '$lib/components/CopyFooter.svelte';
  import { fade } from 'svelte/transition';
  import { page } from '$app/stores';
  import clsx from 'clsx';
  import { isMobile, initMobileDetection } from '$lib/utils/mobile';

  let isMenuOpen = false;

  function closeMenu() {
    isMenuOpen = false;
  }

  initMobileDetection();
</script>

<div class="bg-bg text-text-primary flex min-h-screen">
  <button
    class={clsx(
      'fixed top-2 left-2 z-50 p-1 rounded-md bg-nord1 border border-nord2 text-text-primary hover:bg-nord2 transition-colors',
      $isMobile ? 'block' : 'hidden'
    )}
    on:click={() => (isMenuOpen = !isMenuOpen)}
    aria-label="Toggle menu"
  >
    <i class={clsx('fas text-sm', isMenuOpen ? 'fa-times' : 'fa-bars')}></i>
  </button>

  <Sidebar
    className={clsx(
      'top-0 left-0 fixed',
      !$isMobile && 'block w-[200px] h-screen',
      $isMobile && isMenuOpen && 'fixed inset-0 z-40 w-screen h-screen border-r-0',
      $isMobile && !isMenuOpen && 'hidden'
    )}
    onLinkClick={closeMenu}
  />

  <div class={clsx('flex-1 flex flex-col', !$isMobile && 'ml-[200px]')}>
    {#key $page.url.pathname}
      <main class="flex-1 pt-16 px-8" in:fade={{ duration: 300 }}>
        <slot />
      </main>
    {/key}
    <CopyFooter />
  </div>
</div>
