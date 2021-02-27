<script lang="ts">
</script>

<div class="layout default-layout">
  <div class="page-hero">
    <slot name="hero" />
  </div>
  <div class="page-header">
    <nav>
      <slot name="header" />
    </nav>
  </div>
</div>

<style lang="scss">
  nav {
    width: 100%;
    padding: 1rem;
    border-top: 2px solid var(--secondary);
    border-bottom: 2px solid var(--secondary);
  }
  .page-hero{
    min-width: 100vw;

  }
  .page-header {

    position: sticky;
    top: 0;
    padding: 0;
    margin: 0;
    min-width: 100vw;
  }
</style>
