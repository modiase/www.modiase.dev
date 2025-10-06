<script lang="ts">
  import '$styles/app.scss';
  import CopyFooter from '$lib/components/CopyFooter.svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
</script>

<div class="bg-background text-text-primary flex flex-col min-h-screen">
  <ThemeToggle />
  <slot />
</div>
