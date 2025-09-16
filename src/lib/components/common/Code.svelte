<script lang="ts">
  import { onMount } from 'svelte';
  import { createHighlighter } from 'shiki';
  import { clsx } from 'clsx';

  export let content: string;
  export let language: string = 'text';
  export let className: string = '';
  export let showHeader: boolean = true;
  export let showCopyButton: boolean = true;
  export let rest: Record<string, any> = {};

  let highlightedHtml: string = '';
  let isLoading = true;
  let isCopied = false;

  onMount(async () => {
    try {
      const highlighter = await createHighlighter({
        themes: ['nord'],
        langs: ['python', 'javascript', 'typescript', 'html', 'css', 'json', 'bash', 'sql'],
      });

      highlightedHtml = highlighter.codeToHtml(content, {
        lang: language,
        theme: 'nord',
      });
    } catch (error) {
      console.error('Failed to highlight code:', error);
      highlightedHtml = `<pre><code>${content}</code></pre>`;
    } finally {
      isLoading = false;
    }
  });

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(content);
      isCopied = true;
      setTimeout(() => {
        isCopied = false;
      }, 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      isCopied = true;
      setTimeout(() => {
        isCopied = false;
      }, 2000);
    }
  }
</script>

{#if isLoading}
  <div class={clsx('bg-[var(--nord0)] rounded-lg overflow-hidden my-6', className)} {...rest}>
    {#if showHeader}
      <div class="bg-[var(--nord2)] px-4 py-2 flex items-center justify-between">
        <span class="text-[var(--nord4)] text-sm font-medium">{language}</span>
        {#if showCopyButton}
          <button
            on:click={copyToClipboard}
            class="text-[var(--nord4)] text-sm hover:text-[var(--nord6)] transition-colors"
            title={isCopied ? 'Copied!' : 'Copy to clipboard'}
          >
            {#if isCopied}
              <i class="fas fa-check"></i>
            {:else}
              <i class="fas fa-copy"></i>
            {/if}
          </button>
        {/if}
      </div>
    {/if}
    <div class="p-4">
      <div class="animate-pulse">
        <div class="h-4 bg-[var(--nord3)] rounded w-3/4 mb-2"></div>
        <div class="h-4 bg-[var(--nord3)] rounded w-1/2"></div>
      </div>
    </div>
  </div>
{:else}
  <div class={clsx('not-prose my-6', className)} {...rest}>
    <div class="bg-[var(--nord0)] rounded-lg overflow-hidden">
      {#if showHeader}
        <div class="bg-[var(--nord2)] px-4 py-2 flex items-center justify-between">
          <span class="text-[var(--nord4)] text-sm font-medium">{language}</span>
          {#if showCopyButton}
            <button
              on:click={copyToClipboard}
              class="text-[var(--nord4)] text-sm hover:text-[var(--nord6)] transition-colors"
              title={isCopied ? 'Copied!' : 'Copy to clipboard'}
            >
              {#if isCopied}
                <i class="fas fa-check"></i>
              {:else}
                <i class="fas fa-copy"></i>
              {/if}
            </button>
          {/if}
        </div>
      {/if}
      <div class="overflow-hidden">
        {@html highlightedHtml}
      </div>
    </div>
  </div>
{/if}

<style>
  :global(.shiki) {
    background-color: var(--nord-black) !important;
    margin: 0 !important;
    padding: 1.5rem !important;
    overflow-x: auto;
  }

  :global(.shiki pre) {
    background-color: transparent !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  :global(.shiki code) {
    background-color: transparent !important;
  }
</style>
