import Fastify from 'fastify';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import cors from '@fastify/cors';
import type { Post, ContentBlock } from '../src/lib/types';
import { pipe } from 'fp-ts/lib/function.js';
import * as E from 'fp-ts/lib/Either.js';
import * as T from 'fp-ts/lib/Task.js';
import * as TE from 'fp-ts/lib/TaskEither.js';
import * as O from 'fp-ts/lib/Option.js';
import * as RA from 'fp-ts/lib/ReadonlyArray.js';
import { sequenceS } from 'fp-ts/lib/Apply.js';
import * as t from 'io-ts';
import { PathReporter } from 'io-ts/lib/PathReporter.js';

const fastify = Fastify({
  logger: true,
});

fastify.register(cors, {
  origin: ['http://localhost:5173', 'http://localhost:3000'],
});

/**
 * Read posts from static/posts.json
 * @returns Promise<Post[]> Array of posts
 */
const readPosts = async (): Promise<Post[]> =>
  pipe(
    TE.tryCatch(
      () => readFile(join(process.cwd(), 'static', 'posts.json'), 'utf-8'),
      (err) => `Failed to read posts: ${err}`
    ),
    TE.chainEitherK(E.tryCatchK(JSON.parse, (err) => `Failed to parse JSON: ${err}`)),
    TE.getOrElse((err) => (console.error(err), T.of([])))
  )();

/**
 * Write posts to static/posts.json
 * @param posts - Array of posts to write
 * @returns Promise<void>
 */
const writePosts = async (posts: Post[]): Promise<void> =>
  pipe(
    TE.tryCatch(
      () => writeFile(join(process.cwd(), 'static', 'posts.json'), JSON.stringify(posts, null, 2)),
      (err) => `Failed to read posts: ${err}`
    ),
    TE.getOrElse((err) => T.of(console.error(err)))
  )();

/**
 * Generate UUID for new content blocks
 * @returns string - A new UUID
 */
function generateId(): string {
  return crypto.randomUUID();
}

fastify.get('/api/posts', readPosts);

fastify.get('/api/posts/:postId', async (request, reply) =>
  pipe(
    t.strict({ postId: t.string }).decode(request.params),
    E.mapLeft((errors) => PathReporter.report(E.left(errors)).join(', ')),
    TE.fromEither,
    TE.chainW(({ postId }) =>
      pipe(
        TE.tryCatch(
          () => readPosts(),
          (err) => `Failed to read posts: ${err}`
        ),
        TE.chainOptionK(() => 'Post not found')((posts) =>
          RA.findFirst((p: Post) => p.id === postId)(posts)
        )
      )
    ),
    TE.matchW(
      (error) => reply.status(400).send({ error }),
      (post) => post
    )
  )()
);

fastify.put('/api/posts/:postId/content/:blockId', async (request, reply) =>
  pipe(
    E.Do,
    E.bind('params', () =>
      pipe(
        t.strict({ postId: t.string, blockId: t.string }).decode(request.params),
        E.mapLeft((errors) => PathReporter.report(E.left(errors)).join(', '))
      )
    ),
    E.bind('body', () =>
      pipe(
        t.strict({ content: t.string }).decode(request.body),
        E.mapLeft((errors) => PathReporter.report(E.left(errors)).join(', '))
      )
    ),
    TE.fromEither,
    TE.chainW(({ params: { postId, blockId }, body: { content } }) =>
      pipe(
        TE.Do,
        TE.bind('posts', () =>
          TE.tryCatch(
            () => readPosts(),
            (err) => `Failed to read posts: ${err}`
          )
        ),
        TE.bind('postIndex', ({ posts }) =>
          pipe(
            RA.findIndex((p: Post) => p.id === postId)(posts),
            TE.fromOption(() => 'Post not found')
          )
        ),
        TE.bind('blockIndex', ({ posts, postIndex }) =>
          pipe(
            RA.findIndex((block: ContentBlock) => block.id === blockId)(posts[postIndex].content),
            TE.fromOption(() => 'Content block not found')
          )
        ),
        TE.bind('updatedContent', ({ posts, postIndex, blockIndex }) =>
          pipe(
            RA.modifyAt(blockIndex, (block: ContentBlock) => ({ ...block, content }))(
              posts[postIndex].content
            ),
            TE.fromOption(() => 'Failed to modify block')
          )
        ),
        TE.bind('updatedPosts', ({ posts, postIndex, updatedContent }) =>
          pipe(
            RA.updateAt(postIndex, {
              ...posts[postIndex],
              content: Array.from(updatedContent),
            })(posts),
            TE.fromOption(() => 'Failed to update post'),
            TE.map((p) => Array.from(p) as Post[])
          )
        ),
        TE.chainFirstW(({ updatedPosts }) =>
          TE.tryCatch(
            () => writePosts(updatedPosts),
            (err) => `Failed to write posts: ${err}`
          )
        ),
        TE.map(({ updatedContent, blockIndex }) => ({
          success: true,
          block: updatedContent[blockIndex],
        }))
      )
    ),
    TE.matchW(
      (error) => reply.status(400).send({ error }),
      (result) => result
    )
  )()
);

fastify.delete('/api/posts/:postId/content/:blockId', async (request, reply) =>
  pipe(
    t.strict({ postId: t.string, blockId: t.string }).decode(request.params),
    E.mapLeft((errors) => PathReporter.report(E.left(errors)).join(', ')),
    TE.fromEither,
    TE.chainW(({ postId, blockId }) =>
      pipe(
        TE.Do,
        TE.bind('posts', () =>
          TE.tryCatch(
            () => readPosts(),
            (err) => `Failed to read posts: ${err}`
          )
        ),
        TE.bind('postIndex', ({ posts }) =>
          pipe(
            RA.findIndex((p: Post) => p.id === postId)(posts),
            TE.fromOption(() => 'Post not found')
          )
        ),
        TE.bind('blockIndex', ({ posts, postIndex }) =>
          pipe(
            RA.findIndex((block: ContentBlock) => block.id === blockId)(posts[postIndex].content),
            TE.fromOption(() => 'Content block not found')
          )
        ),
        TE.bind('updatedContent', ({ posts, postIndex, blockIndex }) =>
          pipe(
            RA.deleteAt(blockIndex)(posts[postIndex].content),
            TE.fromOption(() => 'Failed to delete block')
          )
        ),
        TE.bind('updatedPosts', ({ posts, postIndex, updatedContent }) =>
          pipe(
            RA.updateAt(postIndex, {
              ...posts[postIndex],
              content: Array.from(updatedContent),
            })(posts),
            TE.fromOption(() => 'Failed to update post'),
            TE.map((p) => Array.from(p) as Post[])
          )
        ),
        TE.chainFirstW(({ updatedPosts }) =>
          TE.tryCatch(
            () => writePosts(updatedPosts),
            (err) => `Failed to write posts: ${err}`
          )
        ),
        TE.map(() => ({ success: true }))
      )
    ),
    TE.matchW(
      (error) => reply.status(400).send({ error }),
      (result) => result
    )
  )()
);

fastify.post('/api/posts/:postId/content', async (request, reply) =>
  pipe(
    E.Do,
    E.bind('params', () =>
      pipe(
        t.strict({ postId: t.string }).decode(request.params),
        E.mapLeft((errors) => PathReporter.report(E.left(errors)).join(', '))
      )
    ),
    E.bind('body', () =>
      pipe(
        t
          .strict({
            type: t.union([t.literal('markdown'), t.literal('code'), t.literal('aside')]),
            content: t.string,
            language: t.union([t.string, t.undefined]),
            position: t.union([t.literal('before'), t.literal('after')]),
            targetBlockId: t.string,
          })
          .decode(request.body),
        E.mapLeft((errors) => PathReporter.report(E.left(errors)).join(', '))
      )
    ),
    TE.fromEither,
    TE.chainW(
      ({ params: { postId }, body: { type, content, language, position, targetBlockId } }) =>
        pipe(
          TE.Do,
          TE.bind('posts', () =>
            TE.tryCatch(
              () => readPosts(),
              (err) => `Failed to read posts: ${err}`
            )
          ),
          TE.bind('postIndex', ({ posts }) =>
            pipe(
              RA.findIndex((p: Post) => p.id === postId)(posts),
              TE.fromOption(() => 'Post not found')
            )
          ),
          TE.bind('targetBlockIndex', ({ posts, postIndex }) =>
            pipe(
              RA.findIndex((block: ContentBlock) => block.id === targetBlockId)(
                posts[postIndex].content
              ),
              TE.fromOption(() => 'Target content block not found')
            )
          ),
          TE.bind('newBlock', () =>
            TE.right({
              id: generateId(),
              tag: type,
              content,
              ...(type === 'code' && language ? { language } : {}),
            } as ContentBlock)
          ),
          TE.bind('insertIndex', ({ targetBlockIndex }) =>
            TE.right(position === 'before' ? targetBlockIndex : targetBlockIndex + 1)
          ),
          TE.bind('updatedContent', ({ posts, postIndex, insertIndex, newBlock }) =>
            pipe(
              RA.insertAt(insertIndex, newBlock)(posts[postIndex].content),
              TE.fromOption(() => 'Failed to insert block')
            )
          ),
          TE.bind('updatedPosts', ({ posts, postIndex, updatedContent }) =>
            pipe(
              RA.updateAt(postIndex, {
                ...posts[postIndex],
                content: Array.from(updatedContent),
              })(posts),
              TE.fromOption(() => 'Failed to update post'),
              TE.map((p) => Array.from(p) as Post[])
            )
          ),
          TE.chainFirstW(({ updatedPosts }) =>
            TE.tryCatch(
              () => writePosts(updatedPosts),
              (err) => `Failed to write posts: ${err}`
            )
          ),
          TE.map(({ newBlock }) => ({ success: true, block: newBlock }))
        )
    ),
    TE.matchW(
      (error) => reply.status(400).send({ error }),
      (result) => result
    )
  )()
);

fastify.put('/api/posts/:postId/content/:blockId/move', async (request, reply) =>
  pipe(
    E.Do,
    E.bind('params', () =>
      pipe(
        t.strict({ postId: t.string, blockId: t.string }).decode(request.params),
        E.mapLeft((errors) => PathReporter.report(E.left(errors)).join(', '))
      )
    ),
    E.bind('body', () =>
      pipe(
        t.strict({ direction: t.union([t.literal('up'), t.literal('down')]) }).decode(request.body),
        E.mapLeft((errors) => PathReporter.report(E.left(errors)).join(', '))
      )
    ),
    TE.fromEither,
    TE.chainW(({ params: { postId, blockId }, body: { direction } }) =>
      pipe(
        TE.Do,
        TE.bind('posts', () =>
          TE.tryCatch(
            () => readPosts(),
            (err) => `Failed to read posts: ${err}`
          )
        ),
        TE.bind('postIndex', ({ posts }) =>
          pipe(
            RA.findIndex((p: Post) => p.id === postId)(posts),
            TE.fromOption(() => 'Post not found')
          )
        ),
        TE.bind('blockIndex', ({ posts, postIndex }) =>
          pipe(
            RA.findIndex((block: ContentBlock) => block.id === blockId)(posts[postIndex].content),
            TE.fromOption(() => 'Content block not found')
          )
        ),
        TE.bind('moveData', ({ posts, postIndex, blockIndex }) =>
          sequenceS(TE.ApplicativePar)({
            newIndex: pipe(
              direction === 'up' ? blockIndex - 1 : blockIndex + 1,
              O.fromPredicate((idx) => idx >= 0 && idx < posts[postIndex].content.length),
              TE.fromOption(() => 'Cannot move block in that direction')
            ),
            block: pipe(
              RA.lookup(blockIndex)(posts[postIndex].content),
              TE.fromOption(() => 'Failed to lookup block')
            ),
          })
        ),
        TE.bind('withoutBlock', ({ posts, postIndex, blockIndex }) =>
          pipe(
            RA.deleteAt(blockIndex)(posts[postIndex].content),
            TE.fromOption(() => 'Failed to delete block')
          )
        ),
        TE.bind('updatedContent', ({ withoutBlock, moveData: { newIndex, block } }) =>
          pipe(
            RA.insertAt(newIndex, block)(withoutBlock),
            TE.fromOption(() => 'Failed to insert block')
          )
        ),
        TE.bind('updatedPosts', ({ posts, postIndex, updatedContent }) =>
          pipe(
            RA.updateAt(postIndex, {
              ...posts[postIndex],
              content: Array.from(updatedContent),
            })(posts),
            TE.fromOption(() => 'Failed to update post'),
            TE.map((p) => Array.from(p) as Post[])
          )
        ),
        TE.chainFirstW(({ updatedPosts }) =>
          TE.tryCatch(
            () => writePosts(updatedPosts),
            (err) => `Failed to write posts: ${err}`
          )
        ),
        TE.map(({ moveData: { block } }) => ({ success: true, block }))
      )
    ),
    TE.matchW(
      (error) => reply.status(400).send({ error }),
      (result) => result
    )
  )()
);

/**
 * Start server
 */
const start = async () => {
  try {
    console.log('Starting server...');
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log('Server listening on http://localhost:3001');
  } catch (err) {
    console.error('Server error:', err);
    fastify.log.error(err);
    process.exit(1);
  }
};

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  console.log('About to start server...');
  start().catch((err) => {
    console.error('Server failed to start:', err);
    process.exit(1);
  });
}
