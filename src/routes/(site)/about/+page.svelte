<script lang="ts">
  import Link from '$lib/components/Link.svelte';
  import clsx from 'clsx';
  import { isMobile, initMobileDetection } from '$lib/utils/mobile';

  initMobileDetection();
</script>

<div class={clsx('min-h-full flex flex-col gap-8 about-container', !$isMobile && 'ml-[200px]')}>
  <section class="section">
    <p>
      I am a software engineer, based in <em>London, UK</em>. I am a keen naturalist and
      environmentalist. I have spent the last few years working in cleantech and believe that an
      <em>abundant but sustainable future is possible</em>. I have recently refocused my time on
      learning more about AI and how it can be used to accelerate scientific discovery and usher in
      a
      <em>new era of human and environmental flourishing</em>.
    </p>
  </section>
  <section class="section">
    <h2 class="text-lg font-bold mb-2">Education</h2>
    <p>
      I graduated from the University of Cambridge in 2018 having studied for an MSc. in Natural
      Sciences. During this time, I studied Mathematics, Chemistry, Physics and Computer Science
      before ultimately specialising in theoretical chemistry. Prior to that, I was a student at St.
      Bernard's Catholic Grammar School where I learnt much and cultivated a love for the sciences
      and the classical world.
    </p>
  </section>
  <section class="section">
    <h2 class="text-lg font-bold mb-2">Experience</h2>
    <p>
      I have worked in a number of roles within consulting and software engineering and am <em
        >equally enthusiastic about working with code and other people</em
      >. I prefer to work at <em>mission driven organisations</em> and typically try to give as much
      of myself to my work as I am healthily able to since I believe that
      <em>a good life is one lived in service to others</em>. For a fuller listing of my experience,
      please refer to my <Link
        href="https://www.linkedin.com/in/moyewa-odiase-6b4698106/"
        target="_blank"
        rel="noopener noreferrer">LinkedIn</Link
      >.
    </p>
    <p>
      Presently, I am taking some time off from work to appreciate the world, reflect and pursue
      personal projects. I am keen to hear about opportunities to work on AI interpretability and
      applications of AI to scientific discovery and sustainability.
    </p>
  </section>
</div>

<style>
  .section {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    text-align: justify;
    max-width: 800px;
    flex-grow: 0;
  }
  .about-container section:first-child {
    padding-top: 2rem;
    border-top: 1px solid var(--text-secondary);
  }
  .about-container section:last-child {
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--text-secondary);
  }
</style>
