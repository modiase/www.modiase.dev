<script lang="ts">
  import { marked } from 'marked';
  import clsx from 'clsx';
  import { onMount } from 'svelte';
  import Code from '$lib/components/common/Code.svelte';
  import Aside from '$lib/components/common/Aside.svelte';
  import TableOfContents from '$lib/components/common/TableOfContents.svelte';
  import EditContainer from '$lib/components/common/EditContainer.svelte';
  import { slugify } from '$lib/utils/slugify';
  import type { ContentBlock } from '$lib/types';
  import type { HTMLAttributes } from 'svelte/elements';
  import { fromEvent } from 'rxjs';
  import { throttleTime, map, distinctUntilChanged } from 'rxjs/operators';
  import { createSubscriptionManager } from '$lib/utils/rxjs';

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

  export let content: string | ContentBlock[];
  export let className: string = '';
  export let title: string = '';
  export let isEditMode: boolean = false;
  export let postId: string = '';
  export let rest: HTMLAttributes<HTMLDivElement> = {};

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

  const addSubscription = createSubscriptionManager();

  $: contentItems = Array.isArray(content)
    ? content
    : [{ id: crypto.randomUUID(), tag: 'markdown' as const, content: content as string }];

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
    addSubscription(
      fromEvent(window, 'scroll')
        .pipe(
          throttleTime(100, undefined, { leading: true, trailing: true }),
          map(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const innerHeight = window.innerHeight;
            const documentHeight = scrollHeight - innerHeight;

            return {
              progress: documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0,
              activeHeadingId:
                tocItems.length > 0
                  ? tocItems[
                      Math.min(
                        Math.max(Math.floor((scrollTop / documentHeight) * tocItems.length), 0),
                        tocItems.length - 1
                      )
                    ]?.id || ''
                  : '',
              showToc:
                headings.length > 0 && headings[0] && firstParagraph
                  ? Math.abs(headings[0].offsetTop - scrollTop) <=
                    Math.abs(firstParagraph.offsetTop - scrollTop)
                  : (documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0) > 0,
            };
          }),
          distinctUntilChanged(
            (a, b) =>
              a.progress === b.progress &&
              a.activeHeadingId === b.activeHeadingId &&
              a.showToc === b.showToc
          )
        )
        .subscribe(({ progress: p, activeHeadingId: ahId, showToc: st }) => {
          progress = p;
          activeHeadingId = ahId;
          showToc = st;
        })
    );

    const timeoutId = setTimeout(() => {
      const hash = new URL(window.location.href).hash.slice(1);
      if (hash && tocItems.length > 0) {
        const targetItem = tocItems.find((item) => item.id === hash);
        targetItem &&
          requestAnimationFrame(() =>
            window.scrollTo({ top: targetItem.scrollPosition, behavior: 'smooth' })
          );
      }
    }, 50);

    return () => clearTimeout(timeoutId);
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
    <title>{title} | modiase.dev</title>
  {/if}
</svelte:head>

<div class="relative">
  <div class="fixed top-0 left-0 w-full h-1 bg-surface z-50">
    <div
      class="h-full bg-contrast transition-all duration-300 ease-out"
      style="width: {progress}%"
    ></div>
  </div>
  <TableOfContents headings={tocItems} {showToc} {activeHeadingId} />

  <div
    bind:this={container}
    class={clsx(
      'prose prose-lg text-justify max-w-[80vw]',
      '[&>p]:mb-6 [&>h2]:mt-8 [&>h2]:mb-4 [&>h2]:text-xl [&>h2]:font-bold [&_a]:text-contrast [&_a:hover]:text-secondary',
      '[&_.aside-content]:hidden [&_pre]:overflow-auto',
      '[&_h1]:mt-8 [&_h1]:mb-6 [&_h1]:text-2xl [&_h1]:font-bold',
      '[&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-xl [&_h2]:font-bold',
      '[&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold',
      '[&_h4]:mt-4 [&_h4]:mb-2 [&_h4]:text-base [&_h4]:font-semibold',
      '[&_h5]:mt-3 [&_h5]:mb-2 [&_h5]:text-sm [&_h5]:font-semibold',
      '[&_h6]:mt-2 [&_h6]:mb-1 [&_h6]:text-xs [&_h6]:font-semibold',
      '[&_h1]:block [&_h2]:block [&_h3]:block [&_h4]:block [&_h5]:block [&_h6]:block',
      '[&_p+_h1]:mt-8 [&_p+_h2]:mt-8 [&_p+_h3]:mt-6 [&_p+_h4]:mt-4 [&_p+_h5]:mt-3 [&_p+_h6]:mt-2',
      className
    )}
    {...rest}
  >
    {#each contentItems as item}
      <EditContainer {isEditMode} sourceContent={item.content} {postId} blockId={item.id}>
        {#if item.tag === 'markdown'}
          {@html marked(item.content)}
        {:else if item.tag === 'code'}
          <Code content={item.content} language={'language' in item ? item.language : 'text'} />
        {:else if item.tag === 'aside'}
          <Aside content={item.content} {isEditMode} />
        {/if}
      </EditContainer>
    {/each}
  </div>
</div>
