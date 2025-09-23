<script lang="ts">
  import clsx from 'clsx';
  import { onMount } from 'svelte';
  import { BREAKPOINTS } from '$lib/constants/breakpoints';

  export let content: string;
  export let className: string = '';
  export let rest: Record<string, any> = {};

  let asideElement: HTMLElement;
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
    if (!asideElement) return;

    if (isTocBreakpoint) {
      const referenceElement = asideElement.previousElementSibling as HTMLElement;
      if (!referenceElement) return;

      const container = asideElement.closest('.prose') as HTMLElement;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const referenceRect = referenceElement.getBoundingClientRect();

      Object.assign(asideElement.style, {
        position: 'fixed',
        left: `${containerRect.right + 20}px`,
        top: `${referenceRect.top}px`,
        width: '270px',
        zIndex: '10',
      });
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

  $: if (asideElement) {
    requestAnimationFrame(positionAside);
  }
</script>

<aside
  bind:this={asideElement}
  class={clsx('not-prose', isTocBreakpoint ? 'absolute z-10' : 'my-4', className)}
  {...rest}
>
  <div class="p-4 text-sm text-[var(--text-secondary)] italic">
    {content}
  </div>
</aside>

<style>
  :global(.prose) {
    position: relative;
  }
</style>
