<script lang="ts">
  export let title: string;
  export let messages: string[];
</script>

<div class="flex flex-col items-center justify-center p-8 shadow-lg rounded-lg bg-white">
  <h1 class="text-4xl font-bold text-center mb-4">{title}</h1>
  {#each messages as message}
    <p class="text-xl text-center text-gray-600 mb-2">{message}</p>
  {/each}
</div>
