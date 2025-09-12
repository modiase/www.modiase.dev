<script lang="ts">
  import Link from './Link.svelte';
  import Hero from './Hero.svelte';
</script>

<aside class="sidebar">
  <div class="sidebar-content">
    <!-- Mini Hero -->
    <div class="mini-hero">
      <div class="mini-hero-image">
        <img
          src="/assets/images/hero.jpg"
          alt="Moyewa Odiase"
          class="w-16 h-16 object-cover rounded-full"
        />
      </div>
      <h2 class="text-lg font-semibold text-center">Moyewa Odiase</h2>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <a href="/" class="sidebar-link">Home</a>
      <a href="/blog" class="sidebar-link">Blog</a>
      <a href="/about" class="sidebar-link">About</a>
      <a href="/gallery" class="sidebar-link">Gallery</a>
    </nav>
  </div>
</aside>

<style>
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 250px;
    background: linear-gradient(to bottom, var(--nord0) 0%, var(--nord1) 100%);
    border-right: 1px solid var(--nord2);
    z-index: 1000;
  }

  .sidebar-content {
    padding: 2rem 1.5rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .mini-hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .mini-hero-image {
    display: flex;
    justify-content: center;
  }

  .sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .sidebar-link {
    display: block;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
    text-align: center;
    text-decoration: none;
    color: var(--text-secondary);
  }

  .sidebar-link:hover {
    background-color: var(--nord2);
    color: var(--text-contrast);
  }
</style>
