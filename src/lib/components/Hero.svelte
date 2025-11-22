<script lang="ts">
  import Link from './Link.svelte';
  import Tooltip from './common/Tooltip.svelte';
</script>

<div class="flex flex-col items-center pt-[40px]">
  <h1 class="text-4xl text-center mb-4 font-medium">Moyewa Odiase</h1>
  <div class="flex flex-col items-center gap-1 mb-8">
    <p class="text-center font-semibold">Naturalist, Technologist and Software Engineer</p>
    <p class="text-center">Cleantech and safe AI</p>
  </div>
  <div
    class="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-gray-500 rounded-full flex items-center justify-center overflow-hidden"
  >
    <img
      src="/assets/images/hero.jpg"
      alt="Moyewa Odiase"
      class="w-full h-full object-cover rounded-full"
    />
  </div>

  <div class="flex justify-center space-x-8 mt-8">
    <Tooltip text="Posts">
      <Link href="/posts" secondary>
        <i class="fas fa-comment text-3xl"></i>
      </Link>
    </Tooltip>
    <Tooltip text="Gallery">
      <Link href="/gallery" secondary>
        <i class="fas fa-camera text-3xl"></i>
      </Link>
    </Tooltip>
    <Tooltip text="GitHub">
      <Link href="https://github.com/modiase" secondary>
        <i class="fab fa-github text-3xl"></i>
      </Link>
    </Tooltip>
    <Tooltip text="LinkedIn">
      <Link href="https://www.linkedin.com/in/moyewa-odiase-6b4698106/" secondary>
        <i class="fab fa-linkedin text-3xl"></i>
      </Link>
    </Tooltip>
    <Tooltip text="Email">
      <Link href="mailto:hello@modiase.dev" secondary>
        <i class="fas fa-envelope text-3xl"></i>
      </Link>
    </Tooltip>
  </div>
</div>
