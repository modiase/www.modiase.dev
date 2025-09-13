<script lang="ts">
  import '$styles/app.scss';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import CopyFooter from '$lib/components/CopyFooter.svelte';
  import { fade } from 'svelte/transition';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import clsx from 'clsx';

  let isMenuOpen = false;
  let isMobile = false;

  function closeMenu() {
    isMenuOpen = false;
  }

  onMount(() => {
    const checkMobile = () => (isMobile = window.innerWidth < 500);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  });
</script>

<div class="bg-bg text-text-primary font-karla flex min-h-screen">
  <button
    class={clsx(
      'fixed top-2 left-2 z-50 p-1 rounded-md bg-nord1 border border-nord2 text-text-primary hover:bg-nord2 transition-colors',
      isMobile ? 'block' : 'hidden'
    )}
    on:click={() => (isMenuOpen = !isMenuOpen)}
    aria-label="Toggle menu"
  >
    <i class={clsx('fas text-sm', isMenuOpen ? 'fa-times' : 'fa-bars')}></i>
  </button>

  <Sidebar
    className={clsx(
      'top-0 left-0',
      !isMobile && 'block w-[200px] h-screen',
      isMobile && isMenuOpen && 'fixed inset-0 z-40 w-screen h-screen border-r-0',
      isMobile && !isMenuOpen && 'hidden'
    )}
    onLinkClick={closeMenu}
  />

  <div class={clsx('flex-1 flex flex-col')}>
    {#key $page.url.pathname}
      <main class="flex-1" in:fade={{ duration: 300 }}>
        <slot />
      </main>
    {/key}
    <CopyFooter />
  </div>
</div>
