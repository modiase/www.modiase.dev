<script lang="ts">
  import { clsx } from 'clsx';
  import type { HTMLAttributes } from 'svelte/elements';

  export let className: string = '';
  export let bgClassName: string = 'bg-surface-transparent-alt-50';
  export let href: string | undefined = undefined;
  export let rest: HTMLAttributes<HTMLDivElement> = {};
</script>

<div class={clsx('rounded-lg shadow-md p-6', bgClassName, className)} {...rest}>
  {#if href}
    <a {href} class="block focus:outline-none rounded-lg -m-6 p-6">
      <slot />
    </a>
  {:else}
    <slot />
  {/if}
</div>
