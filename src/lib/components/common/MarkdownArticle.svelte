<script lang="ts">
  import { marked } from 'marked';
  import clsx from 'clsx';
  import { onMount } from 'svelte';
  import Card from '$lib/components/common/Card.svelte';
  import { slugify } from '$lib/utils/slugify';

  marked.setOptions({
    breaks: true,
    gfm: true,
    renderer: new marked.Renderer(),
  });

  const renderer = new marked.Renderer();
  renderer.link = function ({ href, title, tokens }) {
    const text = tokens.map((token) => token.raw).join('');
    const isExternal =
      href.startsWith('http') &&
      (typeof window === 'undefined' || !href.includes(window.location.hostname));
    const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
    const titleAttr = title ? ` title="${title}"` : '';
    return `<a href="${href}"${target}${titleAttr}>${text}</a>`;
  };

  marked.setOptions({
    breaks: true,
    gfm: true,
    renderer: renderer,
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
  let tocItems: Array<{ id: string; text: string; level: number; scrollPosition: number }> = [];
  let showToc = false;
  let activeHeadingId = '';
  let firstParagraph: HTMLElement | null = null;
  let introductionHeading: HTMLElement | null = null;

  $: html = marked(content) as string;

  const createIntroductionHeading = (firstParagraph: HTMLElement) => {
    const heading = document.createElement('h2');
    heading.textContent = 'Introduction';
    heading.id = 'introduction';
    heading.style.position = 'absolute';
    heading.style.visibility = 'hidden';
    heading.style.height = '0';
    heading.style.margin = '0';
    heading.style.padding = '0';
    firstParagraph.parentNode?.insertBefore(heading, firstParagraph);
    return heading;
  };

  $: if (activeHeadingId && typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    url.hash = activeHeadingId;
    window.location.href !== url.href && window.history.replaceState(null, '', url.href);
  }

  onMount(() => {
    const getScrollProgress = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      return document.documentElement.scrollHeight - window.innerHeight > 0
        ? (scrollTop / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        : 0;
    };

    const getActiveHeadingId = (scrollTop: number) => {
      if (tocItems.length === 0) return '';

      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      return (
        tocItems[
          Math.min(
            Math.max(Math.floor((scrollTop / documentHeight) * tocItems.length), 0),
            tocItems.length - 1
          )
        ]?.id || ''
      );
    };

    const shouldShowToc = (scrollTop: number) => {
      if (headings.length === 0) return false;

      return headings[0] && firstParagraph
        ? Math.abs(headings[0].offsetTop - scrollTop) <=
            Math.abs(firstParagraph.offsetTop - scrollTop)
        : getScrollProgress() > 0;
    };

    const updateScrollState = () => {
      if (headings.length === 0) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      progress = getScrollProgress();
      activeHeadingId = getActiveHeadingId(scrollTop);
      showToc = shouldShowToc(scrollTop);
    };

    window.addEventListener('scroll', updateScrollState);
    updateScrollState();

    const timeoutId = setTimeout(() => {
      const hash = new URL(window.location.href).hash.slice(1);
      if (hash && tocItems.length > 0) {
        const targetItem = tocItems.find((item) => item.id === hash);
        targetItem &&
          requestAnimationFrame(() => {
            window.scrollTo({ top: targetItem.scrollPosition, behavior: 'smooth' });
          });
      }
    }, 50);

    return () => {
      window.removeEventListener('scroll', updateScrollState);
      clearTimeout(timeoutId);
    };
  });

  $: if (container) {
    headings = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    firstParagraph = container.querySelector('p');

    if (
      firstParagraph &&
      container.firstElementChild &&
      container.firstElementChild !== headings[0] &&
      !introductionHeading
    ) {
      introductionHeading = createIntroductionHeading(firstParagraph);
    }

    headings = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6'));

    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;

    tocItems = headings.map((heading, index) => {
      const text = heading.textContent || '';
      if (!heading.id) {
        heading.id = slugify(text);
      }

      return {
        id: heading.id,
        text,
        level: parseInt(heading.tagName.charAt(1)),
        scrollPosition: (index / (headings.length - 1)) * documentHeight,
      };
    });
  }
</script>

<div class="relative">
  <div class="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
    <div
      class="h-full bg-blue-500 transition-all duration-300 ease-out"
      style="width: {progress}%"
    ></div>
  </div>
  {#if tocItems.length > 0}
    <Card
      className={clsx(
        'hidden md:block fixed right-[12px] top-[12px] w-60 z-40 p-4 text-md',
        'bg-[var(--nord-black)]',
        'transition-all duration-500 ease-in-out',
        showToc ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      )}
    >
      <h3 class="text-sm font-semibold mb-3" style="color: var(--text-secondary);">
        Table of Contents
      </h3>
      <nav class="space-y-1 flex flex-col gap-2">
        {#each tocItems as item}
          <button
            on:click={() => window.scrollTo({ top: item.scrollPosition, behavior: 'smooth' })}
            class={clsx(
              'text-left cursor-pointer hover:text-contrast transition-colors',
              activeHeadingId === item.id ? 'text-contrast font-semibold' : 'text-secondary'
            )}
          >
            {item.text}
          </button>
        {/each}
      </nav>
    </Card>
  {/if}

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
