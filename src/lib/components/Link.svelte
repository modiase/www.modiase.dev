<script lang="ts">
  import { page } from '$app/stores';
  import clsx from 'clsx';

  export let href: string = '#';
  export let target: string | undefined = undefined;
  export let rel: string | undefined = undefined;
  export let disableActive: boolean = false;
  export let onClick: (() => void) | undefined = undefined;
  export let className: string = '';

  $: isActive = !disableActive && $page.url.pathname === href;

  $: linkClasses = clsx(
    'no-underline transition-colors duration-500',
    {
      'text-link-default': !isActive,
      'text-link-active': isActive,
      'hover:text-contrast': true,
    },
    className
  );
</script>

<a {href} {target} {rel} class={linkClasses} on:click={onClick} {...$$restProps}>
  <slot />
</a>
