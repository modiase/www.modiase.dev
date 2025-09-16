import { onMount } from 'svelte';
import { writable } from 'svelte/store';

export const isMobile = writable(false);

export function initMobileDetection() {
  onMount(() => {
    const checkMobile = () => isMobile.set(window.innerWidth < 500);

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  });
}
