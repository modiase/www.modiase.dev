import type { ContentBlockType } from '$lib/types';
import { addEdit as addEditToStore } from '$lib/stores/pendingChanges';

// TODO: duplicated in contentBlock.ts -
// define a util module for frontend and backend to share that code.
export function parsePragmas(content: string): {
  options: Record<string, string>;
  content: string;
} {
  const lines = content.split('\n');
  const options: Record<string, string> = {};
  let contentStartIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line && line.startsWith('#')) {
      const match = line.match(/^#([^=]+)=(.*)$/);
      if (match) {
        const [, key, val] = match;
        options[key.trim()] = val.trim();
        contentStartIndex = i + 1;
      } else {
        break;
      }
    } else {
      break;
    }
  }

  return { options, content: lines.slice(contentStartIndex).join('\n') };
}

export function addEdit(
  blockId: string,
  blockTag: ContentBlockType,
  textareaValue: string,
  sourceContent: string
): void {
  const { options, content } = parsePragmas(textareaValue);

  switch (blockTag) {
    case 'code': {
      const language = options.language ?? null;
      addEditToStore(blockId, 'code', content, sourceContent, { language });
      break;
    }
    case 'markdown':
      addEditToStore(blockId, 'markdown', content, sourceContent, {});
      break;
    case 'aside':
      addEditToStore(blockId, 'aside', content, sourceContent, {});
      break;
    default: {
      const _exhaustive: never = blockTag;
      throw new Error(`Unknown block type: ${_exhaustive}`);
    }
  }
}
