<script lang="ts">
</script>

<div class="layout default-layout">
  <div class="app-hero">
    <slot name="hero" />
  </div>
  <div class="app-header">
    <nav>
      <slot name="header" />
    </nav>
  </div>
  <div class="app-aside">
    <slot name="aside" />
  </div>
  <slot />
  <div class="app-footer">
    <slot name="footer" />
  </div>
</div>

<style lang="scss">
  nav {
    text-decoration: none;
    display: flex;
    width: 100%;
    padding: 1rem;
    border-top: 2px solid var(--secondary);
    border-bottom: 2px solid var(--secondary);
  }
  .app-header {
    position: sticky;
    top: 0;
    padding: 0;
    margin: 0;
    min-width: 100vw;
  }
</style>
