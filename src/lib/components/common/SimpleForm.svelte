<script lang="ts">
  import type { FieldConfig } from '$lib/types/form';

  export let fields: FieldConfig[];
  export let onSubmit: () => void;
  export let submitLabel: string = 'Submit';

  function handleSubmit(event: Event) {
    event.preventDefault();
    onSubmit();
  }
</script>

<form on:submit={handleSubmit} class="space-y-4">
  {#each fields as field, index}
    {@const fieldId = `field-${index}`}
    <div class="flex flex-col">
      <label for={fieldId} class="mb-2 font-medium text-text-primary">{field.label}</label>
      {#if field.type === 'textarea'}
        <textarea
          id={fieldId}
          value={field.value}
          on:input={(e) => field.onChange(e.currentTarget.value)}
          class="px-3 py-2 border border-surface-alt rounded text-text-primary focus:outline-none focus:ring-2 focus:ring-contrast"
          rows="4"
        />
      {:else}
        <input
          id={fieldId}
          type="text"
          value={field.value}
          on:input={(e) => field.onChange(e.currentTarget.value)}
          class="px-3 py-2 border border-surface-alt rounded text-text-primary focus:outline-none focus:ring-2 focus:ring-contrast"
        />
      {/if}
    </div>
  {/each}
  <button
    type="submit"
    class="w-full py-2 px-4 bg-contrast text-background rounded hover:brightness-90 transition-colors font-medium"
  >
    {submitLabel}
  </button>
</form>
