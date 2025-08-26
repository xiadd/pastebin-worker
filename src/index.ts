import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/cloudflare-workers';
import { R2Bucket, D1Database } from '@cloudflare/workers-types';
import { eq } from 'drizzle-orm';

import manifest from '__STATIC_CONTENT_MANIFEST';

import { customAlphabet } from 'nanoid';
import { createDB, pastes, files, type NewPaste, type NewFile } from './db';

const MAX_SIZE = 1024 * 1024 * 25; // 25MB
const FILE_EXPIRE_DAYS = 15; // 15 days
const FILE_EXPIRE_SECONDS = FILE_EXPIRE_DAYS * 24 * 60 * 60; // 15 days in seconds

const ID_SEED =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const nanoid = customAlphabet(ID_SEED, 6);

type Bindings = {
  BUCKET: R2Bucket;
  BASE_URL: string;
  DB: D1Database;
};

// IPaste interface is now replaced by the Paste type from the schema

const app = new Hono<{ Bindings: Bindings }>();

app.use('/api/*', cors());

app.get('/raw/:id', async (c) => {
  const id = c.req.param('id');
  const password = c.req.query('share_password');
  const db = createDB(c.env.DB);

  const res = await db.select().from(pastes).where(eq(pastes.id, id)).get();
  if (!res) {
    return c.text('Not found', { status: 404 });
  }
  const content = res.content;
  const data: any = JSON.parse(res.metadata);
  if (data.share_password) {
    if (!password) {
      return c.text('Private paste, please provide password', { status: 403 });
    }
  }
  if (password !== data.share_password) {
    return c.text('Wrong password', { status: 403 });
  }
  return c.text(content || '');
});

// 创建paste
app.post('/api/create', async (c) => {
  const { content, expire, isPrivate, language, share_password } =
    await c.req.json();

  if (!content) {
    return c.json({ error: 'Content is required' });
  }
  const id = nanoid();
  const createTime = Date.now();
  const pasteBody: any = {
    content,
    expire: expire || 0,
    language: language || 'text',
    create_time: createTime,
    edit_password: share_password || nanoid(8),
    metadata: {
      language: language || 'text',
      create_time: createTime,
    },
  };
  if (isPrivate) {
    pasteBody.metadata.share_password = share_password || nanoid(10);
  }

  const db = createDB(c.env.DB);
  const newPaste: NewPaste = {
    id,
    content: pasteBody.content,
    createTime: pasteBody.create_time,
    editPassword: pasteBody.edit_password,
    language: pasteBody.language,
    expire: pasteBody.expire,
    metadata: JSON.stringify(pasteBody.metadata),
  };

  await db.insert(pastes).values(newPaste);
  return c.json({ id, url: `${c.env.BASE_URL}/detail/${id}`, ...pasteBody });
});

// 更新paste
app.post('/api/update', async (c) => {
  const { id, content, edit_password } = await c.req.json();

  if (!content) {
    return c.json({ error: 'Content is required' });
  }
  const db = createDB(c.env.DB);
  const result = await db.select().from(pastes).where(eq(pastes.id, id)).get();
  if (!result) {
    return c.json({ error: 'Not found' });
  }

  if (result.editPassword !== edit_password) {
    return c.json({ error: 'Wrong password', code: 403 }, { status: 403 });
  }

  await db.update(pastes).set({ content }).where(eq(pastes.id, id));
  return c.json({ url: `${c.env.BASE_URL}/detail/${id}`, ...result });
});

// 获取paste
app.get('/api/get', async (c) => {
  const id = c.req.query('id');
  const password = c.req.query('share_password');
  const db = createDB(c.env.DB);
  const result = await db.select().from(pastes).where(eq(pastes.id, id!)).get();

  if (!result) {
    return c.json({ error: 'Not found' });
  }

  if (result.expire && Date.now() > result.createTime + result.expire * 1000) {
    await db.delete(pastes).where(eq(pastes.id, id!));
    return c.json({ error: 'Paste expired', code: 410 });
  }

  const content = result.content;
  const data: any = JSON.parse(result.metadata);
  if (data.share_password) {
    if (!password) {
      return c.json(
        { error: 'Private paste, please provide password', code: 403 },
        { status: 403 },
      );
    }
    if (password !== data.share_password) {
      return c.json({ error: 'Wrong password', code: 403 }, { status: 403 });
    }
  }
  return c.json({
    content: content,
    url: `${c.env.BASE_URL}/detail/${id}`,
    ...data,
  });
});

// 上传文件
app.post('/api/upload', async (c) => {
  const { file }: { file: File } = await c.req.parseBody();
  if (!file) {
    return c.json({ error: 'File is required' });
  }
  if (file.size > MAX_SIZE) {
    return c.json({ error: 'File is too large' }, { status: 413 });
  }
  const id = nanoid();
  const createTime = Date.now();

  // Store file in R2
  await c.env.BUCKET.put(id, await file.arrayBuffer(), {
    customMetadata: {
      name: file.name,
      size: file.size.toString(),
      type: file.type,
    },
  });

  // Store file record in database
  const db = createDB(c.env.DB);
  const newFile: NewFile = {
    id,
    content: file.name, // Store filename in content field
    createTime,
    expire: FILE_EXPIRE_SECONDS,
    language: file.type || 'application/octet-stream', // Store MIME type
    metadata: JSON.stringify({
      originalName: file.name,
      size: file.size,
      type: file.type,
      createTime,
      expireTime: createTime + FILE_EXPIRE_SECONDS * 1000,
    }),
  };

  await db.insert(files).values(newFile);

  return c.json({
    id,
    url: `${c.env.BASE_URL}/file/${id}`,
    expireTime: createTime + FILE_EXPIRE_SECONDS * 1000,
    expireDays: FILE_EXPIRE_DAYS,
  });
});

// 反代文件
app.get('/file/:id', async (c) => {
  const id = c.req.param('id');
  const db = createDB(c.env.DB);

  // Check file record in database
  const fileRecord = await db
    .select()
    .from(files)
    .where(eq(files.id, id))
    .get();
  if (!fileRecord) {
    return c.text('Not found', { status: 404 });
  }

  // Check if file has expired
  if (
    fileRecord.expire &&
    Date.now() > fileRecord.createTime + fileRecord.expire * 1000
  ) {
    // Delete expired file from R2 and database
    await c.env.BUCKET.delete(id);
    await db.delete(files).where(eq(files.id, id));
    return c.json({ error: 'File expired', code: 410 }, { status: 410 });
  }

  // Get file from R2
  const object = await c.env.BUCKET.get(id);
  if (!object) {
    // File not found in R2, clean up database record
    await db.delete(files).where(eq(files.id, id));
    return c.text('Not found', { status: 404 });
  }

  const headers = new Headers({
    'Content-Disposition': `inline; filename=${object.customMetadata!.name}`,
  });
  object.writeHttpMetadata(headers as any);
  headers.set('etag', object.httpEtag);

  return new Response(object.body as any, {
    headers,
  });
});

app.get('*', serveStatic({ root: './', manifest }));
app.get('*', serveStatic({ path: './index.html', manifest }));

export default app;
