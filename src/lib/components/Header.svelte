<script lang="ts">
  import Link from './Link.svelte';
</script>

<header role="navigation" class="header">
  <nav class="nav gap-16">
    <Link href="/" secondary>Home</Link>
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
    background: linear-gradient(to bottom, var(--bg) 0%, var(--nord1) 100%);
    border-bottom: 1px solid var(--nord2);
    border-radius: 0 0 4px 4px;
    height: 60px;
  }

  .nav {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
</style>
