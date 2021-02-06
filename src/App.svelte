<script lang="ts">
  import { DefaultLayout } from "./layouts";
  import { AppHeader, AppAside, AppFooter } from "components/App";
  import { MessageCard } from "components/common/Card";
</script>

<main>
  <DefaultLayout>
    <div slot="hero">
      <div class="hero-placeholder" />
    </div>
    <div slot="header">
      <AppHeader />
    </div>
    <div slot="aside">
      <AppAside />
    </div>
    <div slot="footer">
      <AppFooter />
    </div>
  </DefaultLayout>
</main>

<style lang="scss">
  .hero-placeholder {
    height: 400px;
    background-color: #333;
  }
  main {
    display: flex;
    position: relative;
    width: 100vw;
    height: 200vh;
  }
</style>
