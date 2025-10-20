import { readable } from 'svelte/store';

export const isDevMode = readable(import.meta.env.DEV);
