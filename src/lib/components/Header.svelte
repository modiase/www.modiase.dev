<script lang="ts">
  import Link from './Link.svelte';
</script>

<header role="navigation" class="header">
  <nav class="nav gap-16">
    <Link href="/">Home</Link>
    <Link href="/blog">Blog</Link>
    <Link href="/about">About</Link>
    <Link href="/gallery">Gallery</Link>
  </nav>
</header>

<style>
  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: linear-gradient(to bottom, var(--nord0) 0%, var(--nord1) 100%);
    border-bottom: 1px solid var(--nord2);
    height: 60px;
  }

  .nav {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
</style>
