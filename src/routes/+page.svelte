<script lang="ts">
  import CopyFooter from '$lib/components/CopyFooter.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import Link from '$lib/components/Link.svelte';
  import { fade } from 'svelte/transition';
</script>

<svelte:head>
  <title>modiase.dev</title>
  <meta
    name="description"
    content="Moyewa Odiase - Software engineer, naturalist and environmentalist"
  />
</svelte:head>

<div class="flex-1 flex flex-col" in:fade={{ duration: 200 }}>
  <main class="relative flex-1 flex items-start lg:items-center justify-center">
    <div
      class="flex flex-col lg:flex-row items-start justify-center gap-8 px-8 py-8 lg:py-16 max-w-7xl mx-auto w-full"
    >
      <div class="flex-shrink-0 w-full lg:w-auto">
        <Hero />
      </div>
      <div
        class="flex-1 lg:pl-8 lg:border-l border-t lg:border-t-0 pt-8 lg:pt-0 border-border max-w-2xl w-full"
      >
        <div class="flex flex-col gap-8">
          <h1 class="text-lg font-bold mb-2">About Me</h1>
          <section>
            <p>
              I am a software engineer based in London, UK. I am a keen naturalist and
              environmentalist. I have spent the last few years working in cleantech and believe
              that an
              <em>abundant but sustainable future is possible</em>. I have recently refocused my
              time on learning more about AI and how it can be used to accelerate scientific
              discovery and usher in a new era of human and environmental flourishing.
            </p>
          </section>
          <section>
            <p>
              I have worked in a number of roles within consulting and software engineering and am
              equally enthusiastic about working with code and other people. I prefer to work at
              mission-driven organisations and typically try to give as much of myself to my work as
              I am healthily able to since I believe that <em
                >a good life is one lived in service to others</em
              >. For a fuller listing of my experience, please refer to my <Link
                href="https://www.linkedin.com/in/moyewa-odiase-6b4698106/"
                target="_blank"
                rel="noopener noreferrer">LinkedIn</Link
              >.
            </p>
            <p>
              I graduated from the University of Cambridge in 2018 having studied for an MSc. in
              Natural Sciences. During this time, I studied Mathematics, Chemistry, Physics and
              Computer Science before ultimately specialising in theoretical chemistry. As a result,
              I am passionate about the applications of AI to accelerate scientific discovery.
            </p>
            <p>
              Presently, I am taking some time off from work to appreciate the world, reflect, and
              pursue personal projects. I am keen to hear about opportunities to work on AI safety,
              interpretability, and applications to scientific discovery.
            </p>
          </section>
        </div>
      </div>
    </div>
  </main>
</div>
<CopyFooter />
