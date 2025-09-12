<script lang="ts">
  export let href: string = '#';
  export let target: string | undefined = undefined;
  export let rel: string | undefined = undefined;
  export let secondary: boolean = false;
</script>

<a {href} {target} {rel} class="text-secondary" class:secondary {...$$restProps}>
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
</style>
