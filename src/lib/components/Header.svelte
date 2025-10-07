<script lang="ts">
  import Link from './Link.svelte';
</script>

<header
  role="navigation"
  class="sticky top-0 left-0 right-0 z-[1000] h-[60px] border-b border-border rounded-b"
>
  <nav class="flex items-center justify-center h-full gap-16 font-bold">
    <Link href="/about" secondary>About</Link>
    <Link href="/posts" secondary>Posts</Link>
    <Link href="/gallery" secondary>Gallery</Link>
  </nav>
</header>

<style>
  header {
    background: linear-gradient(
      to bottom,
      color-mix(in srgb, var(--color-background) 80%, transparent) 0%,
      color-mix(in srgb, var(--color-surface) 80%, transparent) 100%
    );
  }
</style>
