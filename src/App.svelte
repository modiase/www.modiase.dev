<script lang="ts">
  import { LandingPage } from "./templates";
  import { Nav } from "components/Nav";
</script>

<main>
  <LandingPage>
    <div slot="hero">
      <div class="hero-placeholder" />
    </div>
    <div slot="header">
      <Nav />
    </div>
  </LandingPage>
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
  }
</style>
