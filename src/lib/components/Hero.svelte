<script lang="ts">
  import Link from './Link.svelte';
</script>

<div class="flex flex-col items-center pt-[40px]">
  <h1 class="text-4xl text-center mb-4 font-medium">Moyewa Odiase</h1>
  <div class="flex flex-col items-center gap-1 mb-8">
    <p class="text-center font-semibold">Full Stack Software Engineer</p>
    <p class="text-center font-medium">Interested in cleantech, and safe and fair AI</p>
  </div>
  <div class="w-96 h-96 bg-gray-500 rounded-full flex items-center justify-center overflow-hidden">
    <img
      src="/assets/images/hero.jpg"
      alt="Moyewa Odiase"
      class="w-full h-full object-cover rounded-full"
    />
  </div>

  <div class="flex justify-center space-x-8 mt-8">
    <Link
      href="https://github.com/modiase"
      class="text-gray-600 hover:text-gray-800 transition-colors"
      secondary
    >
      <i class="fab fa-github text-3xl"></i>
    </Link>
    <Link
      href="https://www.linkedin.com/in/moyewa-odiase-6b4698106/"
      class="text-gray-600 hover:text-gray-800 transition-colors"
      secondary
    >
      <i class="fab fa-linkedin text-3xl"></i>
    </Link>
    <Link
      href="mailto:hello@modiase.dev"
      class="text-gray-600 hover:text-gray-800 transition-colors"
      secondary
    >
      <i class="fas fa-envelope text-3xl"></i>
    </Link>
  </div>
</div>
