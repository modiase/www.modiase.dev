<script lang="ts">
  export let references: Array<{ text: string; url: string; comment?: string; linkId: string }> =
    [];

  function scrollToLink(linkId: string) {
    const element = document.getElementById(linkId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
</script>

{#if references.length > 0}
  <div class="mt-8 pt-6 border-t border-border">
    <ul class="text-xs text-subtle space-y-2">
      {#each references as ref}
        <li class="break-words">
          <button
            on:click={() => scrollToLink(ref.linkId)}
            class="text-link-default hover:text-link-hover text-left"
          >
            {ref.comment || ref.text}
          </button>
          <span class="opacity-70">:</span>
          <a
            href={ref.url}
            target="_blank"
            rel="noopener noreferrer"
            class="text-link-default hover:text-link-hover opacity-70"
          >
            {ref.url}
          </a>
        </li>
      {/each}
    </ul>
  </div>
{/if}
