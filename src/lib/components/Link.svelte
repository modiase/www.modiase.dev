<script lang="ts">
  import { page } from '$app/stores';
  import clsx from 'clsx';

  export let href: string = '#';
  export let target: string | undefined = undefined;
  export let rel: string | undefined = undefined;
  export let secondary: boolean = false;
  export let disableActive: boolean = false;
  export let onClick: (() => void) | undefined = undefined;
  export let className: string = '';

  $: isActive = !disableActive && $page.url.pathname === href;

  $: linkClasses = clsx(
    'no-underline transition-colors duration-500',
    {
      'hover:text-secondary': !secondary,
      'hover:text-contrast': secondary,
      'text-secondary': secondary != isActive,
      'text-contrast': secondary == isActive,
    },
    className
  );
</script>

<a {href} {target} {rel} class={linkClasses} on:click={onClick} {...$$restProps}>
  <slot />
</a>
