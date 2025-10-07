<script lang="ts">
  import CopyFooter from '$lib/components/CopyFooter.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import Header from '$lib/components/Header.svelte';
  import { fade } from 'svelte/transition';
</script>

<svelte:head>
  <title>modiase.dev</title>
  <meta
    name="description"
    content="Moyewa Odiase - Software engineer, naturalist, and AI researcher exploring the intersection of technology and sustainability"
  />
</svelte:head>

<div class="pt-16 flex-1 flex flex-col" in:fade={{ duration: 200 }}>
  <Header />
  <main class="relative flex-1">
    <div class="absolute top-[38.2%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <Hero />
    </div>
  </main>
</div>
<CopyFooter />
