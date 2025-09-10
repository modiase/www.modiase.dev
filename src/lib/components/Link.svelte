<script lang="ts">
  export let href: string = '#';
  export let target: string | undefined = undefined;
  export let rel: string | undefined = undefined;
</script>

<a {href} {target} {rel} class="text-secondary" {...$$restProps}><slot /></a>

<style>
  a:hover {
    color: var(--text-secondary);
  }
  a {
    text-decoration: none;
    color: var(--text-contrast);
  }
</style>
