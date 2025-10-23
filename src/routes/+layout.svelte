<script lang="ts">
  import '$styles/app.scss';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import { Toaster } from 'svelte-french-toast';
  import { browser } from '$app/environment';
</script>

<div class="bg-background text-text-primary flex flex-col min-h-screen">
  <ThemeToggle />
  <slot />
  {#if browser}
    <Toaster />
  {/if}
</div>
