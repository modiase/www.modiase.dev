<script lang="ts">
  import Card from '$lib/components/common/Card.svelte';
  import clsx from 'clsx';
  import { onMount } from 'svelte';

  export let headings: Array<{
    id: string;
    text: string;
    level: number;
    scrollPosition: number;
    contentItemIndex?: number;
    headingIndex?: number;
  }> = [];
  export let showToc: boolean = false;
  export let activeHeadingId: string = '';
  export let className: string = '';

  onMount(() => {
    if (activeHeadingId && typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.hash = activeHeadingId;
      if (window.location.href !== url.href) {
        window.history.replaceState(null, '', url.href);
      }
    }
  });

  function scrollToHeading(heading: { id: string; scrollPosition: number }) {
    window.scrollTo({ top: heading.scrollPosition, behavior: 'smooth' });
  }
</script>

{#if headings.length > 0}
  <Card
    className={clsx(
      'fixed left-[220px] top-[12px] w-60 z-40 p-2 text-sm',
      'bg-surface-transparent-alt-50',
      'transition-all duration-500 ease-in-out',
      'hidden 2xl:block',
      {
        'opacity-100 translate-x-0': showToc,
        'opacity-0 -translate-x-4': !showToc,
      },
      className
    )}
  >
    <h3 class="text-xs font-semibold mb-2 text-text-secondary">Table of Contents</h3>
    <nav class="space-y-1 flex flex-col gap-1">
      {#each headings as heading, index}
        {@const indentLevel = Math.max(0, heading.level - 1)}

        <button
          on:click={() => scrollToHeading(heading)}
          class={clsx(
            'text-left cursor-pointer hover:text-contrast transition-colors',
            'border-l-2 rounded-r-sm',
            'text-xs w-full',
            {
              'text-link-active border-text-primary font-semibold tracking-tight':
                activeHeadingId === heading.id,
              'text-text-secondary border-transparent hover:border-text-primary':
                activeHeadingId !== heading.id,
            }
          )}
          style="padding-left: {indentLevel * 12 +
            6}px; padding-right: 6px; padding-top: 3px; padding-bottom: 3px;"
        >
          <span class="break-words leading-tight">{heading.text}</span>
        </button>
      {/each}
    </nav>
  </Card>
{/if}
