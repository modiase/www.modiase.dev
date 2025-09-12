<script lang="ts">
  import '$styles/app.scss';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import CopyFooter from '$lib/components/CopyFooter.svelte';
  import { fade } from 'svelte/transition';
  import { page } from '$app/stores';
</script>

<div class="bg-bg text-text-primary font-karla flex min-h-screen" in:fade={{ duration: 200 }}>
  <Sidebar />
  <div class="flex-1 flex flex-col ml-64">
    {#key $page.url.pathname}
      <main class="flex-1" in:fade={{ duration: 200 }}>
        <slot />
      </main>
    {/key}
    <CopyFooter />
  </div>
</div>
