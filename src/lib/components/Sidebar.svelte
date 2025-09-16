<script lang="ts">
  import Link from './Link.svelte';
  import clsx from 'clsx';

  export let className: string = '';
  export let onLinkClick: (() => void) | undefined = undefined;
</script>

<aside class={clsx('sidebar', className)}>
  <div class="p-8 h-full flex flex-col gap-8">
    <!-- Mini Hero -->
    <div class="flex flex-col items-center gap-4">
      <div class="flex justify-center">
        <img
          src="/assets/images/hero.jpg"
          alt="Moyewa Odiase"
          class="w-16 h-16 object-cover rounded-full"
        />
      </div>
      <h2 class="text-lg font-medium text-center">Moyewa Odiase</h2>

      <!-- Social Icons -->
      <div class="flex justify-center space-x-3 mt-2">
        <Link
          href="https://github.com/modiase"
          secondary
        >
          <i class="fab fa-github text-sm"></i>
        </Link>
        <Link
          href="https://www.linkedin.com/in/moyewa-odiase-6b4698106/"
          secondary
        >
          <i class="fab fa-linkedin text-sm"></i>
        </Link>
        <Link
          href="mailto:hello@modiase.dev"
          secondary
        >
          <i class="fas fa-envelope text-sm"></i>
        </Link>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex flex-col gap-4 text-xl">
      <Link href="/" onClick={onLinkClick}>Home</Link>
      <Link href="/about" onClick={onLinkClick}>About</Link>
      <Link href="/posts" onClick={onLinkClick}>Posts</Link>
      <Link href="/gallery" onClick={onLinkClick}>Gallery</Link>
    </nav>

    <!-- Footer -->
    <div class="mt-auto pt-6 border-t border-[var(--nord2)]">
      <div class="flex flex-col items-center justify-center gap-2 text-[var(--nord4)] text-xs text-secondary hover:drop-shadow-[0_0_8px_rgba(216,222,233,0.3)] transition-all duration-500">
        <span class="font-medium text-center">sveltejs x tailwindcss</span>
        <div class="flex items-center justify-center gap-2">
          <img src="/assets/images/svelte.svg" alt="Svelte" class="w-4 h-4 svelte-icon" />
          <img src="/assets/images/tailwind.svg" alt="Tailwind" class="w-4 h-4 tailwind-icon" />
        </div>
      </div>
    </div>
  </div>
</aside>

<style>
  .sidebar {
    background: linear-gradient(to bottom, var(--nord0) 0%, var(--nord1) 100%);
    border-right: 1px solid var(--nord2);
  }
</style>
