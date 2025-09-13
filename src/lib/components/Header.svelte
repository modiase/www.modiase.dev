<script lang="ts">
  import Link from './Link.svelte';
</script>

<header role="navigation" class="header">
  <nav class="nav gap-16">
    <Link href="/blog" secondary>Blog</Link>
    <Link href="/about" secondary>About</Link>
    <Link href="/gallery" secondary>Gallery</Link>
  </nav>
</header>

<style>
  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: linear-gradient(
      to bottom,
      color-mix(in srgb, var(--bg) 80%, transparent) 0%,
      color-mix(in srgb, var(--nord1) 80%, transparent) 100%
    );
    border-bottom: 1px solid var(--nord2);
    border-radius: 0 0 4px 4px;
    height: 30px;
  }

  .nav {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
</style>
