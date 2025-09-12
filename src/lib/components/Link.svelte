<script lang="ts">
  import { page } from '$app/stores';

  export let href: string = '#';
  export let target: string | undefined = undefined;
  export let rel: string | undefined = undefined;
  export let secondary: boolean = false;
  export let highlight: boolean = false;

  $: isActive = highlight && $page.url.pathname === href;
</script>

<a {href} {target} {rel} class:secondary class:active={isActive} {...$$restProps}>
  <slot />
</a>

<style>
  a {
    text-decoration: none;
    color: var(--text-contrast);
  }

  a.secondary {
    color: var(--text-secondary);
  }

  a.secondary:hover {
    color: var(--text-contrast);
  }

  a:not(.secondary):hover {
    color: var(--text-secondary);
  }

  a.active {
    color: var(--text-secondary);
  }

  a.active.secondary {
    color: var(--text-contrast);
  }
</style>
