import { onMount } from 'svelte';
import { writable } from 'svelte/store';

export const isMobile = writable(false);
export const MobileWidthPx = 500;

export function initMobileDetection() {
  onMount(() => {
    const checkMobile = () => isMobile.set(window.innerWidth < MobileWidthPx);

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  });
}
