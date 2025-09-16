<script lang="ts">
  import { marked } from 'marked';
  import clsx from 'clsx';
  import { onMount } from 'svelte';
  import Link from '$lib/components/Link.svelte';
  import Card from '$lib/components/common/Card.svelte';

  marked.setOptions({
    breaks: true,
    gfm: true,
    renderer: new marked.Renderer()
  });

  const renderer = new marked.Renderer();
  renderer.link = function({ href, title, tokens }) {
    const text = tokens.map(token => token.raw).join('');
    const isExternal = href.startsWith('http') && !href.includes(window.location.hostname);
    const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
    const titleAttr = title ? ` title="${title}"` : '';
    return `<a href="${href}"${target}${titleAttr}>${text}</a>`;
  };
  
  marked.setOptions({
    breaks: true,
    gfm: true,
    renderer: renderer
  });

  interface Props {
    content: string;
    className?: string;
    [key: string]: any;
  }

  export let content: string;
  export let className: string = '';
  export let rest: Record<string, any> = {};

  let container: HTMLDivElement;
  let progress = 0;
  let headings: HTMLElement[] = [];
  let tocItems: Array<{ id: string; text: string; level: number }> = [];
  let showToc = false;

  $: html = marked(content) as string;

  onMount(() => {
    const updateProgress = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      showToc = progress > 10;
    };

    const handleScroll = () => {
      updateProgress();
    };

    window.addEventListener('scroll', handleScroll);
    updateProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  $: if (container) {
    headings = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    
    tocItems = headings.map((heading, index) => {
      const id = `heading-${index}`;
      heading.id = id;
      return {
        id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.charAt(1))
      };
    });
  }
</script>

<div class="relative">
  <!-- Progress indicator -->
  <div class="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
    <div
      class="h-full bg-blue-500 transition-all duration-300 ease-out"
      style="width: {progress}%"
    ></div>
  </div>

  <!-- Floating Table of Contents -->
  {#if tocItems.length > 0}
    <Card
      className={clsx(
        'hidden md:block fixed right-[12px] top-[12px] w-80 z-40 p-4',
        'bg-[var(--nord-black)]',
        'transition-all duration-500 ease-in-out',
        showToc ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      )}
    >
      <h3 class="text-sm font-semibold mb-3" style="color: var(--text-secondary);">Table of Contents</h3>
      <nav class="space-y-1 flex flex-col gap-2">
        {#each tocItems as item}
          <Link
            href="#{item.id}"
          >
            {item.text}
          </Link>
        {/each}
      </nav>
    </Card>
  {/if}

  <!-- Content -->
  <div
    bind:this={container}
    class={clsx(
      'prose prose-lg max-w-none text-justify',
      '[&>p]:mb-6 [&>h2]:mt-8 [&>h2]:mb-4 [&>h2]:text-xl [&>h2]:font-bold [&_a]:text-contrast [&_a:hover]:text-secondary',
      className
    )}
    {...rest}
  >
    {@html html}
  </div>
</div>
