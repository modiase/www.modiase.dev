<script lang="ts">
  import { clsx } from 'clsx';

  export let className: string = '';
  export let href: string | undefined = undefined;
  export let rest: Record<string, any> = {};
</script>

<div class={clsx('rounded-lg shadow-md p-6 bg-surface-transparent-alt-50', className)} {...rest}>
  {#if href}
    <a {href} class="block focus:outline-none rounded-lg -m-6 p-6">
      <slot />
    </a>
  {:else}
    <slot />
  {/if}
</div>
