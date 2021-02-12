<script lang="ts">
  type Link = { text: string, link: string};
  const links : Link[] = [{text: "Home", link : "/"}, { text: ""}]
  </script>

<a href="/">Home</a>
<a href="/code">Dev</a>
<a href="/eat">Food</a>
<a href="/make">Projects</a>
<a href="/blog">Thoughts</a>

<style lang="scss">
  a {
    font-size: 2rem;
    padding: 0.5rem;
    &:hover {
      color: var(--tertiary);
    }
  }
</style>
