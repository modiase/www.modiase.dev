<script lang="ts">
  import Link from './Link.svelte';
</script>

<header
  role="navigation"
  class="fixed top-0 left-0 right-0 z-[1000] h-[30px] border-b border-[var(--nord2)] rounded-b"
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
      color-mix(in srgb, var(--bg) 80%, transparent) 0%,
      color-mix(in srgb, var(--nord1) 80%, transparent) 100%
    );
  }
</style>
