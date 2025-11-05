<script lang="ts">
  import { fade } from 'svelte/transition';

  export let text: string;
  export let offset: number = 8;
  export let placement: 'top' | 'bottom' = 'bottom';

  let isActive = false;

  const placementClass = () =>
    placement === 'top'
      ? 'bottom-full left-1/2 -translate-x-1/2'
      : 'top-full left-1/2 -translate-x-1/2';

  const placementStyle = () =>
    placement === 'top' ? `margin-bottom: ${offset}px;` : `margin-top: ${offset}px;`;
</script>

<div
  class="relative inline-flex"
  tabindex="0"
  role="button"
  aria-label={text}
  on:mouseenter={() => (isActive = true)}
  on:mouseleave={() => (isActive = false)}
  on:focus={() => (isActive = true)}
  on:blur={() => (isActive = false)}
>
  <slot />

  {#if isActive}
    <div
      class={`absolute ${placementClass()} z-[1000] pointer-events-none px-2 py-1 text-sm whitespace-nowrap rounded-lg border border-border shadow-lg bg-surface-transparent-alt-40 backdrop-blur-sm text-text-primary font-semibold`}
      style={placementStyle()}
      role="tooltip"
      transition:fade={{ duration: 120 }}
    >
      {text}
    </div>
  {/if}
</div>
