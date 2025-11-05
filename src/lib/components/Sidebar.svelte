<script lang="ts">
  import Link from './Link.svelte';
  import clsx from 'clsx';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { getCurrentTheme } from '$lib/utils/theme';

  export let className: string = '';
  export let onLinkClick: (() => void) | undefined = undefined;

  $: currentPath = $page.url.pathname;

  let isDarkMode = false;

  onMount(() => {
    isDarkMode = getCurrentTheme() === 'dark';

    const observer = new MutationObserver(() => {
      isDarkMode = getCurrentTheme() === 'dark';
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  });
</script>

<aside class={clsx('sidebar', className)}>
  <div class="p-8 h-full flex flex-col gap-8">
    <!-- Mini Hero -->
    <div class="flex flex-col items-center gap-4">
      <div class="flex justify-center">
        <img
          src="/assets/images/hero.jpg"
          alt="Moyewa Odiase"
          class="w-16 h-16 object-cover rounded-full"
        />
      </div>
      <h2 class="text-lg font-medium text-center">Moyewa Odiase</h2>

      <!-- Social Icons -->
      <div class="flex justify-center space-x-3 mt-2">
        <Link href="https://github.com/modiase" secondary>
          <i class="fab fa-github text-sm"></i>
        </Link>
        <Link href="https://www.linkedin.com/in/moyewa-odiase-6b4698106/" secondary>
          <i class="fab fa-linkedin text-sm"></i>
        </Link>
        <Link href="mailto:hello@modiase.dev" secondary>
          <i class="fas fa-envelope text-sm"></i>
        </Link>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex flex-col gap-2 text-xl">
      {#each [{ href: '/', label: 'About' }, { href: '/posts', label: 'Posts' }, { href: '/gallery', label: 'Gallery' }] as navItem}
        {@const isActive =
          currentPath === navItem.href ||
          (navItem.href !== '/' && currentPath.startsWith(navItem.href + '/'))}
        <div
          class={clsx('border-l-2 pl-4 rounded-r-sm my-1 transition-colors', {
            'border-link-active': isActive,
            'border-transparent hover:border-link-active': !isActive,
          })}
        >
          <Link
            href={navItem.href}
            onClick={onLinkClick}
            disableActive
            class={clsx({
              'text-link-active': isActive,
              'text-contrast': !isActive,
            })}>{navItem.label}</Link
          >
        </div>
      {/each}
    </nav>

    <!-- Footer -->
    <div class="mt-auto pt-6 border-t border-border">
      <div
        class="flex flex-col items-center justify-center gap-2 text-text-secondary text-xs text-secondary hover:drop-shadow-[0_0_8px_rgba(216,222,233,0.3)] transition-all duration-500"
      >
        <span class="font-medium text-center">sveltejs x tailwindcss</span>
        <div class="flex items-center justify-center gap-2">
          {#if isDarkMode}
            <img src="/assets/images/svelte-dark.svg" alt="Svelte" class="w-4 h-4" />
            <img src="/assets/images/tailwind-dark.svg" alt="Tailwind" class="w-4 h-4" />
          {:else}
            <img src="/assets/images/svelte-light.svg" alt="Svelte" class="w-4 h-4" />
            <img src="/assets/images/tailwind-light.svg" alt="Tailwind" class="w-4 h-4" />
          {/if}
        </div>
      </div>
    </div>
  </div>
</aside>

<style>
  .sidebar {
    background: linear-gradient(to bottom, var(--color-background) 0%, var(--color-surface) 100%);
    border-right: 1px solid var(--color-border);
  }
</style>
