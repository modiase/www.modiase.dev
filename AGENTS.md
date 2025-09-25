# AI Agent Guidelines for www.modiase.dev

This document provides guidance for AI agents working on this SvelteKit project.

## Code Style & Best Practices

### CSS & Styling

- **Always prefer `clsx` with Tailwind classes** over direct component styling or `<style>` tags
- Use `clsx` object notation for conditional classes:

  ```svelte
  <!-- ✅ Good -->
  class={clsx('base-class', {
    'conditional-class': condition,
    'another-class': anotherCondition,
  })}

  <!-- ❌ Avoid -->
  class={clsx('base-class', condition ? 'conditional-class' : 'another-class')}
  ```

- Only use `<style>` tags for complex CSS that cannot be achieved with Tailwind utilities
- Avoid inline styles unless absolutely necessary for dynamic values

### Code Quality & Refactoring

After every change, perform an additional pass to:

1. **Inline once-used variables**

   ```svelte
   <!-- ✅ Good -->
   <div class={clsx('base', { 'active': isActive })}>

   <!-- ❌ Avoid if only used once -->
   {#if someCondition}
     {@const tempVar = someValue}
     <div class={tempVar}>
   {/if}
   ```

2. **Remove self-explanatory comments**

   ```svelte
   <!-- ✅ Good - only comment non-obvious logic -->
   // Calculate scroll position based on document height and viewport const scrollProgress = (scrollTop
   / (documentHeight - viewportHeight)) * 100;

   <!-- ❌ Avoid - self-explanatory -->
   // Set the title document.title = title;
   ```

3. **Extract common functionality into functions** (only if used frequently)

   ```svelte
   <!-- ✅ Good - if this pattern appears 3+ times -->
   function getResponsiveClasses(isActive: boolean) {
     return clsx('base-class', {
       'active-class': isActive,
       'inactive-class': !isActive
     });
   }

   <!-- ❌ Avoid - if only used once or twice -->
   function doSomething() {
     // Single use function
   }
   ```

4. **Avoid over-abstraction**
   - Don't extract functions for incidental repetition
   - Repetition is often acceptable if it's only 2-3 occurrences
   - Focus on meaningful abstractions that improve maintainability

## Project Structure

### Key Directories

- `src/routes/` - SvelteKit routes and pages
- `src/lib/components/` - Reusable Svelte components
- `src/lib/utils/` - Utility functions
- `src/styles/` - Global SCSS styles
- `static/` - Static assets

### Component Organization

- Components are organized by feature in `src/lib/components/`
- Common/shared components go in `src/lib/components/common/`
- Each component should be self-contained with its own styles

## Technology Stack

- **Framework**: SvelteKit
- **Styling**: Tailwind CSS + SCSS
- **TypeScript**: Full TypeScript support
- **Build**: Vite
- **Deployment**: Static site generation

## Development Guidelines

### Component Props

- Always define proper TypeScript interfaces for props
- Use descriptive prop names
- Provide sensible defaults
- Document complex props with JSDoc comments

### State Management

- Use Svelte stores for global state
- Prefer local component state when possible
- Use reactive statements (`$:`) for derived state

### Performance

- Use `onMount` for DOM manipulation
- Implement proper cleanup in `onDestroy`
- Use `{#key}` blocks for forcing re-renders when needed
- Prefer `bind:` over manual DOM queries when possible

### Accessibility

- Always include proper ARIA labels
- Use semantic HTML elements
- Ensure keyboard navigation works
- Test with screen readers when possible

## Common Patterns

### Conditional Rendering

```svelte
{#if condition}
  <div>Content</div>
{/if}
```

### Dynamic Classes

```svelte
<div class={clsx('base-class', {
  'active': isActive,
  'disabled': isDisabled
})}>
```

### Event Handling

```svelte
<button on:click={handleClick} on:keydown={handleKeydown}> Click me </button>
```

### Props with Defaults

```svelte
<script lang="ts">
  export let title: string = 'Default Title';
  export let isVisible: boolean = true;
</script>
```

## Testing & Quality

- Run `npm run check` to verify TypeScript and linting
- Ensure all changes pass pre-commit hooks
- Test responsive behavior on different screen sizes
- Verify accessibility with keyboard navigation

## Deployment

- The project uses static site generation
- Build artifacts go to the `build/` directory
- Ensure all routes are properly prerendered
- Test the built site locally before deployment

## File Naming Conventions

- Components: PascalCase (e.g., `MarkdownArticle.svelte`)
- Utilities: camelCase (e.g., `slugify.ts`)
- Routes: kebab-case (e.g., `[slug]/+page.svelte`)
- Styles: kebab-case (e.g., `_base.scss`)

## Common Gotchas

1. **SvelteKit routing**: Use `$app/stores` for navigation state
2. **SSR considerations**: Check `typeof window !== 'undefined'` for browser-only code
3. **Reactive statements**: Be careful with dependencies to avoid infinite loops
4. **Component lifecycle**: Use `onMount` for DOM access, not in the top-level script

## Getting Help

- Check the [SvelteKit documentation](https://kit.svelte.dev/)
- Review existing components for patterns
- Test changes thoroughly before committing
- Follow the established code style and patterns in the codebase
