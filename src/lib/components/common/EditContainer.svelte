<script lang="ts">
  import clsx from 'clsx';
  import EditContent from './EditContent.svelte';
  import { toast } from 'svelte-french-toast';
  import { BehaviorSubject } from 'rxjs';
  import { createSubscriptionManager } from '$lib/utils/rxjs';
  import { onMount } from 'svelte';
  import {
    addEdit,
    addDelete,
    removeChange,
    hasChange,
    commitAllChanges,
  } from '$lib/stores/pendingChanges';
  import { CONTENT_BLOCK_TYPES, addContentBlock, moveContentBlock } from '$lib/utils/api';
  import type { ContentBlockType } from '$lib/types';

  const State = {
    VIEWING: 'VIEWING',
    EDITING: 'EDITING',
    DELETING: 'DELETING',
  } as const;

  export let isEditMode: boolean = false;
  export let sourceContent: string = '';
  export let postId: string = '';
  export let blockId: string = '';

  const state$ = new BehaviorSubject<keyof typeof State>(State.VIEWING);
  const isLoading$ = new BehaviorSubject<boolean>(false);
  const addSubscription = createSubscriptionManager();

  let slotElement: HTMLElement;
  let textareaValue = '';

  let state: keyof typeof State = State.VIEWING;
  let isLoading = false;
  let hasPendingChange = false;

  $: if (state === State.EDITING && textareaValue !== sourceContent) {
    addEdit(blockId, textareaValue, sourceContent);
  }

  $: buttonConfig = [
    {
      icon: 'arrow-up.svg',
      alt: 'Move up',
      onClick: handleMoveUp,
      disabled: state === State.DELETING || isLoading,
    },
    {
      icon: state === State.EDITING ? 'database.svg' : 'pencil.svg',
      alt: state === State.EDITING ? (isLoading ? 'Saving...' : 'Save All') : 'Edit',
      onClick: toggleEditing,
      disabled: state === State.DELETING || isLoading,
    },
    {
      icon: state === State.DELETING || state === State.EDITING ? 'undo.svg' : 'plus.svg',
      alt: state === State.DELETING ? 'Undo' : state === State.EDITING ? 'Undo' : 'Add',
      onClick:
        state === State.DELETING ? undoDelete : state === State.EDITING ? undoEdit : () => {},
      isDropdownTrigger: state === State.VIEWING,
      disabled: isLoading,
    },
    {
      icon: state === State.DELETING ? 'database.svg' : 'cross.svg',
      alt: state === State.DELETING ? (isLoading ? 'Saving...' : 'Save All') : 'Delete',
      onClick: toggleDeleting,
      disabled: state === State.EDITING || isLoading,
    },
    {
      icon: 'arrow-down.svg',
      alt: 'Move down',
      onClick: handleMoveDown,
      disabled: state === State.DELETING || isLoading,
    },
  ];

  onMount(() => {
    addSubscription(state$.subscribe((val) => (state = val)));
    addSubscription(isLoading$.subscribe((val) => (isLoading = val)));

    hasPendingChange = hasChange(blockId);
  });

  function toggleEditing() {
    if (state$.value === State.VIEWING) {
      textareaValue = sourceContent;
      state$.next(State.EDITING);
      addEdit(blockId, textareaValue, sourceContent);
      hasPendingChange = true;
    } else if (state$.value === State.EDITING) {
      isLoading$.next(true);
      addSubscription(
        commitAllChanges(postId).subscribe({
          error: (error) => {
            console.error('Failed to save changes:', error);
            toast.error('Failed to save changes. Please try again.');
            isLoading$.next(false);
          },
        })
      );
    }
  }

  function undoEdit() {
    if (state$.value === State.EDITING) {
      removeChange(blockId);
      state$.next(State.VIEWING);
      hasPendingChange = false;
    }
  }

  function toggleDeleting() {
    if (state$.value === State.VIEWING) {
      state$.next(State.DELETING);
      addDelete(blockId);
      hasPendingChange = true;
    } else if (state$.value === State.DELETING) {
      isLoading$.next(true);
      addSubscription(
        commitAllChanges(postId).subscribe({
          error: (error) => {
            console.error('Failed to save changes:', error);
            toast.error('Failed to save changes. Please try again.');
            isLoading$.next(false);
          },
        })
      );
    }
  }

  function undoDelete() {
    if (state$.value === State.DELETING) {
      removeChange(blockId);
      state$.next(State.VIEWING);
      hasPendingChange = false;
    }
  }

  function handleAddContentBlock(tag: ContentBlockType) {
    isLoading$.next(true);
    const content = {
      markdown: 'New content block',
      code: '// New code block',
      aside: 'New aside content',
    }[tag];

    addSubscription(
      addContentBlock(postId, {
        tag,
        content,
        position: 'after',
        targetBlockId: blockId,
      }).subscribe({
        next: () => {
          toast.success('Block added successfully');
          window.location.reload();
        },
        error: (error) => {
          console.error('Failed to add block:', error);
          toast.error('Failed to add block. Please try again.');
          isLoading$.next(false);
        },
      })
    );
  }

  function handleMove(direction: 'up' | 'down') {
    isLoading$.next(true);
    addSubscription(
      moveContentBlock(postId, blockId, direction).subscribe({
        next: () => {
          window.location.reload();
        },
        error: (error) => {
          console.error('Failed to move block:', error);
          toast.error('Failed to move block.');
          isLoading$.next(false);
        },
      })
    );
  }

  const handleMoveUp = () => handleMove('up');
  const handleMoveDown = () => handleMove('down');
</script>

{#if isEditMode}
  <div
    class={clsx(
      'group relative box-border border-2 transition-all duration-200 hover:border-contrast',
      {
        'border-red-500': state === State.DELETING,
        'border-yellow-500': state === State.EDITING,
        'border-orange-400': hasPendingChange && state === State.VIEWING,
        'border-transparent': !hasPendingChange && state === State.VIEWING,
      }
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
        {#if button.isDropdownTrigger && state === State.VIEWING}
          <div class="relative group/dropdown">
            <button
              class="p-2 bg-contrast text-background disabled:opacity-50 disabled:cursor-not-allowed"
              on:click={button.onClick}
              disabled={button.disabled}
            >
              <img src="/assets/icons/{button.icon}" alt={button.alt} class="w-4 h-4" />
            </button>
            <div
              class="absolute -left-0.5 top-8 bg-contrast text-primary-dark font-semibold shadow-lg p-2 min-w-32 z-10 hidden group-hover/dropdown:block"
              role="menu"
              tabindex="-1"
            >
              {#each CONTENT_BLOCK_TYPES as item}
                <button
                  class="w-full text-center text-sm transition-colors hover:bg-black/20 py-1"
                  on:click={() => handleAddContentBlock(item.tag)}
                >
                  {item.label}
                </button>
              {/each}
            </div>
          </div>
        {:else}
          <button
            class="p-2 bg-contrast text-background disabled:opacity-50 disabled:cursor-not-allowed"
            on:click={button.onClick}
            disabled={button.disabled}
          >
            <img src="/assets/icons/{button.icon}" alt={button.alt} class="w-4 h-4" />
          </button>
        {/if}
      {/each}
    </div>
  </div>
{:else}
  <div bind:this={slotElement}>
    <slot />
  </div>
{/if}
