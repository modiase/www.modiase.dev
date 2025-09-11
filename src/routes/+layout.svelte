<script lang="ts">
  import '../app.scss';
  import Header from '$lib/components/Header.svelte';
</script>

<div class="min-h-screen bg-bg text-text-primary font-karla">
  <Header />
  <div class="pt-16">
    <slot />
  </div>
</div>
