<script lang="ts">
  import Link from './Link.svelte';
  import clsx from 'clsx';

  export let className: string = '';
  export let onLinkClick: (() => void) | undefined = undefined;
</script>

<aside class={clsx('sidebar', className)}>
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

      <!-- Social Icons -->
      <div class="flex justify-center space-x-3 mt-2">
        <Link
          href="https://github.com/modiase"
          class="text-gray-600 hover:text-gray-800 transition-colors"
          secondary
        >
          <i class="fab fa-github text-sm"></i>
        </Link>
        <Link
          href="https://www.linkedin.com/in/moyewa-odiase-6b4698106/"
          class="text-gray-600 hover:text-gray-800 transition-colors"
          secondary
        >
          <i class="fab fa-linkedin text-sm"></i>
        </Link>
        <Link
          href="mailto:hello@modiase.dev"
          class="text-gray-600 hover:text-gray-800 transition-colors"
          secondary
        >
          <i class="fas fa-envelope text-sm"></i>
        </Link>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav text-xl gap-8">
      <Link href="/" highlight onClick={onLinkClick}>Home</Link>
      <Link href="/blog" highlight onClick={onLinkClick}>Blog</Link>
      <Link href="/about" highlight onClick={onLinkClick}>About</Link>
      <Link href="/gallery" highlight onClick={onLinkClick}>Gallery</Link>
    </nav>
  </div>
</aside>

<style>
  .sidebar {
    background: linear-gradient(to bottom, var(--nord0) 0%, var(--nord1) 100%);
    border-right: 1px solid var(--nord2);
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
</style>
