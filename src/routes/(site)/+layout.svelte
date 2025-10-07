<script lang="ts">
  import '$styles/app.scss';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import CopyFooter from '$lib/components/CopyFooter.svelte';
  import { fade } from 'svelte/transition';
  import { page } from '$app/stores';
  import clsx from 'clsx';

  let isMenuOpen = false;

  function closeMenu() {
    isMenuOpen = false;
  }
</script>

<div class="bg-bg text-text-primary flex min-h-screen">
  <button
    class="lg:hidden fixed top-1 left-2 z-50 p-2 rounded-full bg-white/10 backdrop-blur-sm text-text-primary hover:scale-110 transition-all duration-300"
    on:click={() => (isMenuOpen = !isMenuOpen)}
    aria-label="Toggle menu"
  >
    <i
      class={clsx('fas text-sm', {
        'fa-times': isMenuOpen,
        'fa-bars': !isMenuOpen,
      })}
    ></i>
  </button>

  <Sidebar
    className={clsx('top-0 left-0 fixed h-screen', {
      'block lg:hidden w-screen z-40 border-r-0': isMenuOpen,
      'hidden lg:block w-[200px]': !isMenuOpen,
    })}
    onLinkClick={closeMenu}
  />

  <div class="flex-1 flex flex-col lg:ml-[200px]">
    {#key $page.url.pathname}
      <main class="flex-1 pt-16 px-8" in:fade={{ duration: 300 }}>
        <slot />
      </main>
    {/key}
    <CopyFooter />
  </div>
</div>
