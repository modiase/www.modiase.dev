import Fastify, { type FastifyReply } from 'fastify';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import cors from '@fastify/cors';
import type { Post, ContentBlock } from '../src/lib/types';
import { flow, identity, pipe } from 'fp-ts/lib/function.js';
import * as E from 'fp-ts/lib/Either.js';
import * as T from 'fp-ts/lib/Task.js';
import * as TE from 'fp-ts/lib/TaskEither.js';
import * as O from 'fp-ts/lib/Option.js';
import * as RA from 'fp-ts/lib/ReadonlyArray.js';
import * as t from 'io-ts';
import { PathReporter } from 'io-ts/lib/PathReporter.js';
import { handleEdit, handleAdd } from './handlers/contentBlocks.js';

const fastify = Fastify({
  logger: true,
});
fastify.register(cors, {
  origin: ['http://localhost:5173', 'http://localhost:3000'],
});

const decode =
  <O>(decoder: t.Decoder<unknown, O>) =>
  (reply: FastifyReply): ((input: unknown) => E.Either<FastifyReply, O>) =>
    flow(
      decoder.decode,
      E.mapLeft((errors) => reply.status(400).send(PathReporter.report(E.left(errors)).join(', ')))
    );

const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

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
const writePosts = async (posts: readonly Post[]): Promise<void> =>
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
const generateId = (): string => crypto.randomUUID();

fastify.get('/api/posts', readPosts);

fastify.post('/api/posts', async (request, reply) =>
  pipe(
    request.body,
    TE.fromEitherK(
      decode(t.strict({ title: t.string, lead: t.string, tags: t.array(t.string) }))(reply)
    ),
    TE.chain(({ title, lead, tags }) =>
      pipe(
        TE.Do,
        TE.bind('posts', () =>
          TE.tryCatch(
            () => readPosts(),
            (err) => reply.status(500).send({ error: `Failed to read posts: ${err}` })
          )
        ),
        TE.bind('newPost', () =>
          TE.right({
            id: generateId(),
            slug: slugify(title),
            title,
            date: new Date().toISOString(),
            lead,
            content: [],
            tags,
          } as Post)
        ),
        TE.bind('updatedPosts', ({ posts, newPost }) => TE.right([...posts, newPost] as Post[])),
        TE.chainFirstW(({ updatedPosts }) =>
          TE.tryCatch(
            () => writePosts(updatedPosts),
            (err) => reply.status(400).send({ error: `Failed to write posts: ${err}` })
          )
        )
      )
    ),
    TE.match(identity, ({ newPost }) => reply.status(201).send({ success: true, post: newPost }))
  )()
);

fastify.get('/api/posts/:postId', async (request, reply) =>
  pipe(
    request.params,
    TE.fromEitherK(decode(t.strict({ postId: t.string }))(reply)),
    TE.chainW(({ postId }) =>
      pipe(
        TE.tryCatch(
          () => readPosts(),
          (err) => reply.status(500).send({ error: `Failed to read posts: ${err}` })
        ),
        TE.chainOptionK(() => reply.status(404).send({ error: 'Post not found' }))((posts) =>
          RA.findFirst((p: Post) => p.id === postId)(posts)
        )
      )
    ),
    TE.match(identity, (post) => reply.status(200).send(post))
  )()
);

fastify.put('/api/posts/:postId/content/:blockId', async (request, reply) =>
  pipe(
    E.Do,
    E.bind('params', () =>
      pipe(request.params, decode(t.strict({ postId: t.string, blockId: t.string }))(reply))
    ),
    TE.fromEitherK(
      E.bind('body', () => pipe(request.body, decode(t.strict({ content: t.string }))(reply)))
    ),
    TE.chain(({ params: { postId, blockId }, body: { content } }) =>
      pipe(
        TE.Do,
        TE.bind('posts', () =>
          TE.tryCatch(
            () => readPosts(),
            (err) => reply.status(500).send({ error: `Failed to read posts: ${err}` })
          )
        ),
        TE.bind('postIndex', ({ posts }) =>
          pipe(
            RA.findIndex((p: Post) => p.id === postId)(posts),
            TE.fromOption(() => reply.status(404).send({ error: 'Post not found' }))
          )
        ),
        TE.bind('blockIndex', ({ posts, postIndex }) =>
          pipe(
            RA.findIndex((block: ContentBlock) => block.id === blockId)(posts[postIndex].content),
            TE.fromOption(() => reply.status(404).send({ error: 'Content block not found' }))
          )
        ),
        TE.bind('updatedBlock', ({ posts, postIndex, blockIndex }) =>
          pipe(
            TE.fromOption(() => reply.status(404).send({ error: 'Content block not found' }))(
              RA.lookup(blockIndex)(posts[postIndex].content)
            ),
            TE.chain((block) =>
              pipe(
                TE.fromEitherK(handleEdit)(block, content),
                TE.mapLeft((err) => reply.status(400).send({ error: err }))
              )
            )
          )
        ),
        TE.bind('updatedPosts', ({ posts, postIndex, blockIndex, updatedBlock }) =>
          pipe(
            RA.modifyAt(blockIndex, () => updatedBlock)(posts[postIndex].content),
            O.chain((updatedContent) =>
              RA.updateAt(postIndex, {
                ...posts[postIndex],
                content: Array.from(updatedContent),
              })(posts)
            ),
            TE.fromOption(() => reply.status(500).send({ error: 'Failed to update block' }))
          )
        ),
        TE.chainFirst(({ updatedPosts }) =>
          TE.tryCatch(
            () => writePosts(updatedPosts),
            (err) => reply.status(500).send({ error: `Failed to write posts: ${err}` })
          )
        )
      )
    ),
    TE.match(identity, () => reply.status(200).send({ success: true }))
  )()
);

fastify.delete('/api/posts/:postId/content/:blockId', async (request, reply) =>
  pipe(
    request.params,
    decode(t.strict({ postId: t.string, blockId: t.string }))(reply),
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
    E.bind('params', () => pipe(request.params, decode(t.strict({ postId: t.string }))(reply))),
    TE.fromEitherK(
      E.bind('body', () =>
        pipe(
          request.body,
          decode(
            t.strict({
              tag: t.union([t.literal('markdown'), t.literal('code'), t.literal('aside')]),
              content: t.string,
              position: t.union([t.literal('before'), t.literal('after')]),
              targetBlockId: t.union([t.string, t.undefined]),
            })
          )(reply)
        )
      )
    ),
    TE.chain(({ params: { postId }, body: { tag, content, position, targetBlockId } }) =>
      pipe(
        TE.Do,
        TE.bind('posts', () =>
          TE.tryCatch(
            () => readPosts(),
            (err) => reply.status(500).send({ error: `Failed to read posts: ${err}` })
          )
        ),
        TE.bind('postIndex', ({ posts }) =>
          pipe(
            RA.findIndex((p: Post) => p.id === postId)(posts),
            TE.fromOption(() => reply.status(404).send({ error: 'Post not found' }))
          )
        ),
        TE.bind('targetBlockIndex', ({ posts, postIndex }) =>
          targetBlockId === undefined
            ? TE.right(-1)
            : pipe(
                RA.findIndex((block: ContentBlock) => block.id === targetBlockId)(
                  posts[postIndex].content
                ),
                TE.fromOption(() =>
                  reply.status(404).send({ error: 'Target content block not found' })
                )
              )
        ),
        TE.bind('newBlock', () =>
          pipe(
            TE.fromEitherK(handleAdd)(generateId(), tag, content),
            TE.mapLeft((err) => reply.status(400).send({ error: err }))
          )
        ),
        TE.bind('insertIndex', ({ targetBlockIndex }) =>
          TE.right(
            targetBlockIndex === -1
              ? 0
              : position === 'before'
                ? targetBlockIndex
                : targetBlockIndex + 1
          )
        ),
        TE.bind('updatedContent', ({ posts, postIndex, insertIndex, newBlock }) =>
          pipe(
            RA.insertAt(insertIndex, newBlock)(posts[postIndex].content),
            TE.fromOption(() => reply.status(500).send({ error: 'Failed to insert block' }))
          )
        ),
        TE.bind('updatedPosts', ({ posts, postIndex, updatedContent }) =>
          pipe(
            RA.updateAt(postIndex, {
              ...posts[postIndex],
              content: Array.from(updatedContent),
            })(posts),
            TE.fromOption(() => reply.status(500).send({ error: 'Failed to update post' })),
            TE.map((p) => Array.from(p) as Post[])
          )
        ),
        TE.chainFirst(({ updatedPosts }) =>
          TE.tryCatch(
            () => writePosts(updatedPosts),
            (err) => reply.status(500).send({ error: `Failed to write posts: ${err}` })
          )
        )
      )
    ),
    TE.match(identity, ({ newBlock }) => reply.status(200).send({ success: true, newBlock }))
  )()
);

fastify.put('/api/posts/:postId/content/:blockId/move', async (request, reply) =>
  pipe(
    E.Do,
    E.bind('params', () =>
      pipe(request.params, decode(t.strict({ postId: t.string, blockId: t.string }))(reply))
    ),
    TE.fromEitherK(
      E.bind('body', () =>
        pipe(
          request.body,
          decode(t.strict({ direction: t.union([t.literal('up'), t.literal('down')]) }))(reply)
        )
      )
    ),
    TE.chain(({ params: { postId, blockId }, body: { direction } }) =>
      pipe(
        TE.Do,
        TE.bind('posts', () =>
          TE.tryCatch(
            () => readPosts(),
            (err) => reply.status(500).send({ error: `Failed to read posts: ${err}` })
          )
        ),
        TE.bind('postIndex', ({ posts }) =>
          pipe(
            RA.findIndex((p: Post) => p.id === postId)(posts),
            TE.fromOption(() => reply.status(404).send({ error: 'Post not found' }))
          )
        ),
        TE.bind('blockIndex', ({ posts, postIndex }) =>
          pipe(
            RA.findIndex((block: ContentBlock) => block.id === blockId)(posts[postIndex].content),
            TE.fromOption(() => reply.status(404).send({ error: 'Content block not found' }))
          )
        ),
        TE.bind('updatedContent', ({ posts, postIndex, blockIndex }) =>
          pipe(
            O.Do,
            O.bind('newIndex', () =>
              pipe(
                direction === 'up' ? blockIndex - 1 : blockIndex + 1,
                O.fromPredicate((idx) => idx >= 0 && idx < posts[postIndex].content.length)
              )
            ),
            O.bind('block', () => pipe(posts[postIndex].content, RA.lookup(blockIndex))),
            O.chain(({ block, newIndex }) =>
              pipe(
                posts[postIndex].content,
                RA.deleteAt(blockIndex),
                O.chain(RA.insertAt(newIndex, block))
              )
            ),
            TE.fromOption(() =>
              reply.status(400).send({ error: 'Cannot move block in that direction' })
            )
          )
        ),
        TE.bind('updatedPosts', ({ posts, postIndex, updatedContent }) =>
          pipe(
            RA.updateAt(postIndex, {
              ...posts[postIndex],
              content: Array.from(updatedContent),
            })(posts),
            TE.fromOption(() => reply.status(500).send({ error: 'Failed to update post' })),
            TE.map((p) => Array.from(p) as Post[])
          )
        ),
        TE.chainFirst(({ updatedPosts }) =>
          TE.tryCatch(
            () => writePosts(updatedPosts),
            (err) => reply.status(500).send({ error: `Failed to write posts: ${err}` })
          )
        )
      )
    ),
    TE.match(identity, ({ blockIndex }) => reply.status(200).send({ success: true, blockIndex }))
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
