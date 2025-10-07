<script lang="ts">
  import { onMount } from 'svelte';
  import { clsx } from 'clsx';
  import { getCurrentTheme, setTheme } from '$lib/utils/theme';

  let mode: 'light' | 'dark' = 'light';

  onMount(() => {
    mode = getCurrentTheme();
  });

  function toggleMode() {
    mode = mode === 'light' ? 'dark' : 'light';
    setTheme(mode);
    localStorage.setItem('theme-mode', mode);
  }
</script>

<button
  on:click={toggleMode}
  class={clsx(
    'fixed left-10 lg:left-2 top-2 z-[1010] p-2 rounded-full transition-all duration-300',
    'hover:scale-110',
    'bg-white/10 backdrop-blur-sm'
  )}
  title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
>
  {#if mode === 'light'}
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <path
        d="M12 1v3M12 20v3M3.93 3.93l2.12 2.12M17.95 17.95l2.12 2.12M1 12h3M20 12h3M3.93 20.07l2.12-2.12M17.95 7.05l2.12-2.12"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
  {:else}
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <mask id="moon-mask">
          <rect width="24" height="24" fill="white" />
          <circle cx="15" cy="9" r="8" fill="black" />
        </mask>
      </defs>
      <circle cx="12" cy="12" r="9" fill="currentColor" mask="url(#moon-mask)" />
    </svg>
  {/if}
</button>
