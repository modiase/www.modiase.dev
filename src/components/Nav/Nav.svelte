<script lang="ts">
  let vertical = true;
  type navItem = { text: string, link: string};
  const navItems : navItem[] = [
    {text: "Home", link : "/"}, 
    { text: "Dev", link: "https://github.com/Moyoka22"},
    { text: "Food", link: "https://blog.modiase.dev/eat"},
    { text: "Projects", link: "https://blog.modiase.dev/build"},
    { text: "Thoughts", link: "https://blog.modiase.dev/thoughts"}
  ];
</script>

<ul class:vertical={vertical}>
{#each navItems as navItem}
  <li><a href={navItem.link}><p class="heading">{navItem.text}</p></a></li>
{/each}
</ul>

<style lang="scss">
  ul{
    display: flex;
  }
  .vertical{
    flex-direction: column;
  }
  li{
     padding: 0.5rem;
     margin: 0;
  }
  a {
    text-decoration: none;
    font-size: 2rem;
    &:hover {
      color: var(--tertiary);
    }
  }
</style>
