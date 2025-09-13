<script lang="ts">
  import '$styles/app.scss';
  import CopyFooter from '$lib/components/CopyFooter.svelte';
</script>

<div class="bg-bg text-text-primary font-karla flex flex-col min-h-screen">
  <slot />
</div>
