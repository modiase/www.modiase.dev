import type { ContentBlock, ContentBlockType } from '../../src/lib/types';
import * as E from 'fp-ts/lib/Either.js';
import { pipe } from 'fp-ts/lib/function.js';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as O from 'fp-ts/lib/Option.js';
import * as RA from 'fp-ts/lib/ReadonlyArray.js';
import { PathReporter } from 'io-ts/lib/PathReporter';

const validate =
  <T>(decoder: t.Decoder<unknown, T>) =>
  (input: unknown): E.Either<string, T> =>
    pipe(
      decoder.decode(input),
      E.mapLeft((errors) => PathReporter.report(E.left(errors)).join(', '))
    );

export const parseBlockPragma = (
  content: string
): E.Either<string, { options: Record<string, string>; content: string }> =>
  pipe(
    E.Do,
    E.bind('lines', () => E.right(content.split('\n'))),
    E.bind('optionPairs', ({ lines }) =>
      E.right(
        pipe(
          lines,
          RA.map(
            (line): O.Option<[string, string]> =>
              pipe(
                line.startsWith('#') ? line : null,
                O.fromNullable,
                O.chainNullableK((l) => l.match(/^#([^=]+)=(.*)$/)),
                O.map(([, key, value]): [string, string] => [key.trim(), value.trim()])
              )
          )
        )
      )
    ),
    E.bind('contentStartIndex', ({ lines, optionPairs }) =>
      pipe(
        optionPairs,
        RA.findIndex(O.isNone),
        O.getOrElse(() => lines.length),
        E.right
      )
    ),
    E.bind('options', ({ optionPairs, contentStartIndex }) =>
      pipe(
        optionPairs,
        RA.takeLeft(contentStartIndex),
        RA.compact,
        (pairs) => Object.fromEntries(pairs),
        E.right
      )
    ),
    E.map(({ lines, contentStartIndex, options }) => ({
      options,
      content: lines.slice(contentStartIndex).join('\n'),
    }))
  );

const validateCodeBlockOptions = (
  options: Record<string, string>
): E.Either<string, { language: string }> =>
  pipe(
    validate(t.strict({ language: tt.NonEmptyString }))(options),
    E.map(({ language }) => ({ language: language.trim() })),
    E.chain(({ language }) => validate(t.strict({ language: tt.NonEmptyString }))({ language }))
  );

export const handleCreateMarkdownBlock = (
  id: string,
  content: string
): E.Either<string, ContentBlock> =>
  pipe(
    parseBlockPragma(content),
    E.map(({ content: blockContent }) => ({
      id,
      tag: 'markdown' as const,
      content: blockContent,
    }))
  );

export const handleCreateCodeBlock = (
  id: string,
  content: string
): E.Either<string, ContentBlock> =>
  pipe(
    E.Do,
    E.bind('parsed', () => parseBlockPragma(content)),
    E.bind('validated', ({ parsed }) =>
      validateCodeBlockOptions({ language: 'text', ...parsed.options })
    ),
    E.map(({ parsed, validated }) => ({
      id,
      tag: 'code' as const,
      content: parsed.content,
      language: validated.language,
    }))
  );

export const handleCreateAsideBlock = (
  id: string,
  content: string
): E.Either<string, ContentBlock> =>
  pipe(
    parseBlockPragma(content),
    E.map(({ content: blockContent }) => ({
      id,
      tag: 'aside' as const,
      content: blockContent,
    }))
  );

export const handleEditMarkdownBlock = (
  block: ContentBlock,
  content: string
): E.Either<string, ContentBlock> =>
  pipe(
    E.Do,
    E.filterOrElse(
      () => block.tag === 'markdown',
      () => 'Block is not a markdown block'
    ),
    E.chain(() => parseBlockPragma(content)),
    E.map(({ content: blockContent }) => ({
      ...block,
      content: blockContent,
    }))
  );

export const handleEditCodeBlock = (
  block: ContentBlock,
  content: string
): E.Either<string, ContentBlock> =>
  pipe(
    E.Do,
    E.filterOrElse(
      () => block.tag === 'code',
      () => 'Block is not a code block'
    ),
    E.bind('parsed', () => parseBlockPragma(content)),
    E.bind('validated', ({ parsed }) => validateCodeBlockOptions(parsed.options)),
    E.map(({ parsed, validated }) => ({
      ...block,
      content: parsed.content,
      language: validated.language,
    }))
  );

export const handleEditAsideBlock = (
  block: ContentBlock,
  content: string
): E.Either<string, ContentBlock> =>
  pipe(
    E.Do,
    E.filterOrElse(
      () => block.tag === 'aside',
      () => 'Block is not an aside block'
    ),
    E.chain(() => parseBlockPragma(content)),
    E.map(({ content: blockContent }) => ({
      ...block,
      content: blockContent,
    }))
  );

export const handleEdit = (
  block: ContentBlock,
  content: string
): E.Either<string, ContentBlock> => {
  switch (block.tag) {
    case 'markdown':
      return handleEditMarkdownBlock(block, content);
    case 'code':
      return handleEditCodeBlock(block, content);
    case 'aside':
      return handleEditAsideBlock(block, content);
    default: {
      const _exhaustive: never = block;
      return E.left(`Unknown block type: ${(_exhaustive as ContentBlock).tag}`);
    }
  }
};

export const handleAdd = (
  id: string,
  tag: ContentBlockType,
  content: string
): E.Either<string, ContentBlock> => {
  switch (tag) {
    case 'markdown':
      return handleCreateMarkdownBlock(id, content);
    case 'code':
      return handleCreateCodeBlock(id, content);
    case 'aside':
      return handleCreateAsideBlock(id, content);
    default: {
      const _exhaustive: never = tag;
      return E.left(`Unknown block type: ${_exhaustive}`);
    }
  }
};
