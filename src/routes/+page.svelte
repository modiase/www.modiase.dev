<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import Header from '$lib/components/Header.svelte';
  import { fade } from 'svelte/transition';
</script>

<div class="pt-16 flex-1 flex flex-col" in:fade={{ duration: 700 }}>
  <Header />
  <main class="relative flex-1">
    <div class="absolute top-[38.2%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <Hero />
    </div>
  </main>
</div>
