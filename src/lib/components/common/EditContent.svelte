<script lang="ts">
  import { onMount } from 'svelte';

  export let value: string = '';
  export let placeholder: string = '';
  export let className: string = '';

  let textarea: HTMLTextAreaElement;

  function autoResize() {
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }

  onMount(() => {
    autoResize();
  });
</script>

<textarea
  bind:this={textarea}
  bind:value
  {placeholder}
  class="w-full p-2 border border-contrast rounded bg-background resize-none overflow-hidden {className}"
  on:input={autoResize}
></textarea>
