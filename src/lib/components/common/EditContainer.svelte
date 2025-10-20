<script lang="ts">
  import clsx from 'clsx';
  import EditContent from './EditContent.svelte';

  const State = {
    VIEWING: 'VIEWING',
    EDITING: 'EDITING',
    DELETING: 'DELETING',
  } as const;

  export let isEditMode: boolean = false;
  export let sourceContent: string = '';

  let state: keyof typeof State = State.VIEWING;
  let slotElement: HTMLElement;
  let textareaValue = '';
  let showDropdown = false;

  $: buttonConfig = [
    {
      icon: 'arrow-up.svg',
      alt: 'Add before',
      onClick: () => {},
      disabled: state === State.DELETING,
    },
    {
      icon: state === State.EDITING ? 'database.svg' : 'pencil.svg',
      alt: state === State.EDITING ? 'Save' : 'Edit',
      onClick: toggleEditing,
      disabled: state === State.DELETING,
    },
    {
      icon: state === State.DELETING || state === State.EDITING ? 'undo.svg' : 'plus.svg',
      alt: state === State.DELETING || state === State.EDITING ? 'Undo' : 'Add',
      onClick:
        state === State.DELETING
          ? toggleDeleting
          : state === State.EDITING
            ? toggleEditing
            : () => {},
      onMouseEnter: state === State.VIEWING ? () => (showDropdown = true) : undefined,
      onMouseLeave: state === State.VIEWING ? () => (showDropdown = false) : undefined,
    },
    {
      icon: state === State.DELETING ? 'database.svg' : 'cross.svg',
      alt: state === State.DELETING ? 'Confirm delete' : 'Delete',
      onClick: toggleDeleting,
      disabled: state === State.EDITING,
    },
    {
      icon: 'arrow-down.svg',
      alt: 'Add after',
      onClick: () => {},
      disabled: state === State.DELETING,
    },
  ];

  function toggleEditing() {
    if (state === State.VIEWING) {
      textareaValue = sourceContent;
      state = State.EDITING;
    } else if (state === State.EDITING) {
      state = State.VIEWING;
    }
  }

  function toggleDeleting() {
    if (state === State.VIEWING) {
      textareaValue = sourceContent;
      state = State.DELETING;
    } else if (state === State.DELETING) {
      state = State.VIEWING;
    }
  }

  function addContentBlock(type: string) {
    console.log(`Add ${type} block`);
    showDropdown = false;
  }

  const dropdownConfig = [
    { type: 'markdown', label: 'Markdown' },
    { type: 'code', label: 'Code' },
    { type: 'aside', label: 'Aside' },
  ];
</script>

{#if isEditMode}
  <div
    class={clsx(
      'group relative box-border border-2 border-transparent transition-all duration-200 hover:border-contrast'
    )}
  >
    {#if state === State.EDITING || state === State.DELETING}
      <EditContent
        bind:value={textareaValue}
        className={state === State.DELETING ? 'line-through' : ''}
      />
    {:else}
      <div bind:this={slotElement}>
        <slot />
      </div>
    {/if}
    <div
      class="absolute -right-0.5 -top-8 opacity-0 group-hover:opacity-100 transition-opacity flex shadow-lg [&>button:first-child]:rounded-tl-lg [&>button:last-child]:rounded-tr-lg"
    >
      {#each buttonConfig as button}
        <button
          class="p-2 bg-contrast text-background disabled:opacity-50 disabled:cursor-not-allowed"
          on:click={button.onClick}
          on:mouseenter={button.onMouseEnter}
          on:mouseleave={button.onMouseLeave}
          disabled={button.disabled}
        >
          <img src="/assets/icons/{button.icon}" alt={button.alt} class="w-4 h-4" />
        </button>
      {/each}
    </div>

    {#if showDropdown}
      <div
        class="absolute -right-0.5 top-0 bg-contrast text-primary-dark font-semibold shadow-lg p-2 min-w-32"
        role="menu"
        tabindex="-1"
        on:mouseenter={() => (showDropdown = true)}
        on:mouseleave={() => (showDropdown = false)}
      >
        {#each dropdownConfig as item}
          <button
            class="w-full text-center text-sm transition-colors hover:bg-black/20"
            on:click={() => addContentBlock(item.type)}
          >
            {item.label}
          </button>
        {/each}
      </div>
    {/if}
  </div>
{:else}
  <div bind:this={slotElement}>
    <slot />
  </div>
{/if}
