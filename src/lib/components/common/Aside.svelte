<script lang="ts">
  import clsx from 'clsx';
  import { onMount } from 'svelte';
  import { BREAKPOINTS } from '$lib/constants/breakpoints';

  export let content: string;
  export let className: string = '';
  export let rest: Record<string, any> = {};

  let asideElement: HTMLElement;
  let placeholderElement: HTMLElement;
  let isTocBreakpoint = true;

  onMount(() => {
    const checkBreakpoint = () => {
      isTocBreakpoint = window.innerWidth >= BREAKPOINTS['2xl'];
    };

    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);

    return () => {
      window.removeEventListener('resize', checkBreakpoint);
    };
  });

  const positionAside = () => {
    if (!asideElement || !placeholderElement) return;

    if (isTocBreakpoint) {
      const placeholderRect = placeholderElement.getBoundingClientRect();
      const container = placeholderElement.closest('.prose');
      const containerRect = container?.getBoundingClientRect();

      if (containerRect) {
        const relativeTop = placeholderRect.top - containerRect.top;
        const relativeLeft = placeholderRect.right - containerRect.left + 920;

        Object.assign(asideElement.style, {
          position: 'absolute',
          left: `${relativeLeft}px`,
          top: `${relativeTop}px`,
          width: '270px',
          zIndex: '10',
        });
      }
    } else {
      Object.assign(asideElement.style, {
        position: '',
        left: '',
        top: '',
        width: '',
        zIndex: '',
      });
    }
  };

  $: if (asideElement && placeholderElement && isTocBreakpoint !== undefined) {
    requestAnimationFrame(positionAside);
  }
</script>

{#if isTocBreakpoint}
  <!-- Invisible placeholder that stays in document flow -->
  <div bind:this={placeholderElement} class="invisible w-0 h-0" aria-hidden="true"></div>

  <!-- Floating aside positioned relative to placeholder -->
  <aside bind:this={asideElement} class={clsx('not-prose absolute z-10', className)} {...rest}>
    <div class="p-4 text-sm text-[var(--text-secondary)] italic">
      {content}
    </div>
  </aside>
{:else}
  <!-- Inline aside for mobile -->
  <aside bind:this={asideElement} class={clsx('not-prose my-4', className)} {...rest}>
    <div class="p-4 text-sm text-[var(--text-secondary)] italic">
      {content}
    </div>
  </aside>
{/if}

<style>
  :global(.prose) {
    position: relative;
  }
</style>
