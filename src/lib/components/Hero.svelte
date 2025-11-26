<script lang="ts">
  import Link from './Link.svelte';
  import Tooltip from './common/Tooltip.svelte';
</script>

<div class="flex flex-col items-center">
  <h1 class="text-4xl text-center mb-4 font-medium">Moyewa Odiase</h1>
  <div class="flex flex-col items-center gap-1 mb-8">
    <p class="text-sm text-center font-semibold">Naturalist, Technologist and Software Engineer</p>
  </div>
  <div
    class="w-48 h-48 sm:w-30 sm:h-30 lg:w-64 lg:h-64 bg-gray-500 rounded-full flex items-center justify-center overflow-hidden"
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
        <i class="fas fa-comment text-2xl"></i>
      </Link>
    </Tooltip>
    <Tooltip text="Gallery">
      <Link href="/gallery" secondary>
        <i class="fas fa-camera text-2xl"></i>
      </Link>
    </Tooltip>
    <Tooltip text="GitHub">
      <Link href="https://github.com/modiase" secondary>
        <i class="fab fa-github text-2xl"></i>
      </Link>
    </Tooltip>
    <Tooltip text="LinkedIn">
      <Link href="https://www.linkedin.com/in/moyewa-odiase-6b4698106/" secondary>
        <i class="fab fa-linkedin text-2xl"></i>
      </Link>
    </Tooltip>
    <Tooltip text="Email">
      <Link href="mailto:hello@modiase.dev" secondary>
        <i class="fas fa-envelope text-2xl"></i>
      </Link>
    </Tooltip>
  </div>
</div>
