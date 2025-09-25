<script lang="ts">
  import { marked } from 'marked';
  import clsx from 'clsx';
  import { onMount } from 'svelte';
  import Code from '$lib/components/common/Code.svelte';
  import Aside from '$lib/components/common/Aside.svelte';
  import TableOfContents from '$lib/components/common/TableOfContents.svelte';
  import { slugify } from '$lib/utils/slugify';
  import type { ContentBlock } from '$lib/types';

  const renderer = new marked.Renderer();
  renderer.link = function ({ href, title, tokens }) {
    const text = tokens.map((token) => token.raw).join('');
    const isExternal =
      href.startsWith('http') &&
      (typeof window === 'undefined' || !href.includes(window.location.hostname));
    return `<a href="${href}"${isExternal ? ' target="_blank" rel="noopener noreferrer"' : ''}${title ? ` title="${title}"` : ''}>${text}</a>`;
  };

  renderer.em = function ({ tokens }) {
    const text = tokens.map((token) => token.raw).join('');
    if (text.match(/^(Aside|Note|Tip|Warning|Important):/i)) {
      return `<aside class="aside-content">${text}</aside>`;
    }
    return `<em>${text}</em>`;
  };

  marked.setOptions({
    breaks: true,
    gfm: true,
    renderer: renderer,
  });

  interface Props {
    content: string | ContentBlock[];
    className?: string;
    title?: string;
    [key: string]: any;
  }

  export let content: string | ContentBlock[];
  export let className: string = '';
  export let title: string = '';
  export let rest: Record<string, any> = {};

  let container: HTMLDivElement;
  let progress = 0;
  let headings: HTMLElement[] = [];
  let tocItems: Array<{
    id: string;
    text: string;
    level: number;
    scrollPosition: number;
    contentItemIndex: number;
    headingIndex: number;
  }> = [];
  let showToc = false;
  let activeHeadingId = '';
  let firstParagraph: HTMLElement | null = null;
  let introductionHeading: HTMLElement | null = null;

  $: html = typeof content === 'string' ? (marked(content) as string) : '';
  $: contentItems = Array.isArray(content) ? content : [];

  const createIntroductionHeading = (firstParagraph: HTMLElement) => {
    const heading = document.createElement('h2');
    heading.textContent = 'Introduction';
    heading.id = 'introduction';
    Object.assign(heading.style, {
      position: 'absolute',
      visibility: 'hidden',
      height: '0',
      margin: '0',
      padding: '0',
    });
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

  function extractHeadingsFromContent() {
    const extractedHeadings: Array<{
      id: string;
      text: string;
      level: number;
      scrollPosition: number;
      contentItemIndex: number;
      headingIndex: number;
    }> = [];

    if (Array.isArray(content)) {
      content.forEach((item, contentIndex) => {
        if (item.tag === 'markdown') {
          const html = marked(item.content) as string;
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = html;
          const headingElements = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');

          headingElements.forEach((heading, headingIndex) => {
            const text = heading.textContent || '';
            extractedHeadings.push({
              id: slugify(text),
              text,
              level: parseInt(heading.tagName.charAt(1)),
              scrollPosition: 0,
              contentItemIndex: contentIndex,
              headingIndex: headingIndex,
            });
          });
        }
      });
    }

    return extractedHeadings;
  }

  $: if (container) {
    const domHeadings = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    const contentHeadings = extractHeadingsFromContent();

    headings = domHeadings.length > 0 ? (domHeadings as HTMLElement[]) : [];
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

      const contentHeading = contentHeadings.find((ch) => ch.id === heading.id);

      return {
        id: heading.id,
        text,
        level: parseInt(heading.tagName.charAt(1)),
        scrollPosition: headings.length > 1 ? (index / (headings.length - 1)) * documentHeight : 0,
        contentItemIndex: contentHeading?.contentItemIndex ?? -1,
        headingIndex: contentHeading?.headingIndex ?? -1,
      };
    });
  }
</script>

<svelte:head>
  {#if title}
    <title>{title} | Modiase.dev</title>
  {/if}
</svelte:head>

<div class="relative">
  <div class="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
    <div
      class="h-full bg-blue-500 transition-all duration-300 ease-out"
      style="width: {progress}%"
    ></div>
  </div>
  <TableOfContents headings={tocItems} {showToc} {activeHeadingId} />

  <div
    bind:this={container}
    class={clsx(
      'prose prose-lg text-justify max-w-[80vw] overflow-x-hidden',
      '[&>p]:mb-6 [&>h2]:mt-8 [&>h2]:mb-4 [&>h2]:text-xl [&>h2]:font-bold [&_a]:text-contrast [&_a:hover]:text-secondary',
      '[&_.aside-content]:hidden',
      className
    )}
    {...rest}
  >
    {#if typeof content === 'string'}
      {@html html}
    {:else}
      {#each contentItems as item}
        {#if item.tag === 'markdown'}
          {@html marked(item.content)}
        {:else if item.tag === 'code'}
          <Code content={item.content} language={item.language || 'text'} />
        {:else if item.tag === 'aside'}
          <Aside content={item.content} />
        {/if}
      {/each}
    {/if}
  </div>
</div>
