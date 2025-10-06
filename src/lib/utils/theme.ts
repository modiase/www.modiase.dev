/**
 * Get the current theme from the document
 * @returns 'dark' if data-theme="dark", 'light' otherwise
 */
export function getCurrentTheme(): 'light' | 'dark' {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

/**
 * Set the theme on the document
 * @param theme - The theme to set
 */
export function setTheme(theme: 'light' | 'dark'): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.removeAttribute('data-theme');
  }
}
