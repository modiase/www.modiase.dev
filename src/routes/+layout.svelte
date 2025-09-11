<script lang="ts">
  import '../app.scss';
  import Header from '$lib/components/Header.svelte';
  import CopyFooter from '$lib/components/CopyFooter.svelte';
</script>

<div class="bg-bg text-text-primary font-karla flex flex-col min-h-screen">
  <Header />
  <div class="pt-16 flex-1 flex flex-col">
    <slot />
    <CopyFooter />
  </div>
</div>
