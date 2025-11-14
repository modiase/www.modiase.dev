<script lang="ts">
  import clsx from 'clsx';
  import type { HTMLAttributes } from 'svelte/elements';
  import { onMount } from 'svelte';
  import { fromEvent } from 'rxjs';
  import { throttleTime } from 'rxjs/operators';
  import { createSubscriptionManager } from '$lib/utils/rxjs';

  export let content: string;
  export let className: string = '';
  export let rest: HTMLAttributes<HTMLElement> = {};
  export let isEditMode: boolean = false;

  let asideElement: HTMLElement;
  let placeholderElement: HTMLElement;

  const addSubscription = createSubscriptionManager();

  const positionAside = () => {
    if (!asideElement || !placeholderElement) return;

    // offsetParent === null indicates element is hidden (display: none)
    if (placeholderElement.offsetParent === null) return;

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
  };

  $: if (asideElement && placeholderElement) {
    requestAnimationFrame(positionAside);
  }

  onMount(() => {
    addSubscription(
      fromEvent(window, 'resize')
        .pipe(throttleTime(100, undefined, { leading: true, trailing: true }))
        .subscribe(() => {
          requestAnimationFrame(positionAside);
        })
    );

    if (typeof window !== 'undefined') {
      const breakpoint2xl = getComputedStyle(document.documentElement)
        .getPropertyValue('--breakpoint-2xl')
        .trim();
      const mediaQuery = window.matchMedia(`(min-width: ${breakpoint2xl})`);
      const handleMediaChange = () => {
        requestAnimationFrame(positionAside);
      };

      mediaQuery.addEventListener('change', handleMediaChange);

      return () => {
        mediaQuery.removeEventListener('change', handleMediaChange);
      };
    }
  });

  const asideContent = () =>
    `<div class="p-4 text-sm text-[var(--text-secondary)] italic">${content}</div>`;
</script>

{#if !isEditMode}
  <!-- Invisible placeholder that stays in document flow (only on 2xl+) -->
  <div
    bind:this={placeholderElement}
    class="invisible w-0 h-0 hidden 2xl:block"
    aria-hidden="true"
  ></div>

  <!-- Floating aside positioned relative to placeholder (only on 2xl+) -->
  <aside
    bind:this={asideElement}
    class={clsx(
      'not-prose absolute z-10 hidden 2xl:block border-t border-b border-link-active',
      className
    )}
    {...rest}
  >
    {@html asideContent()}
  </aside>

  <!-- Inline aside for mobile (below 2xl) -->
  <aside
    class={clsx('not-prose my-4 w-full 2xl:hidden border-t border-b border-link-active', className)}
    {...rest}
  >
    {@html asideContent()}
  </aside>
{:else}
  <!-- Edit mode: always show inline -->
  <aside
    class={clsx('not-prose my-4 w-full border-t border-b border-link-active', className)}
    {...rest}
  >
    {@html asideContent()}
  </aside>
{/if}
