import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/cloudflare-workers';
import {
  KVNamespace,
  KVNamespacePutOptions,
  R2Bucket,
} from '@cloudflare/workers-types';

import manifest from '__STATIC_CONTENT_MANIFEST';

import { customAlphabet } from 'nanoid';

const MAX_SIZE = 1024 * 1024 * 25; // 25MB

const ID_SEED =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_';

const nanoid = customAlphabet(ID_SEED, 6);

type Bindings = {
  PB: KVNamespace;
  PBIMGS: KVNamespace;
  BUCKET: R2Bucket;
  BASE_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('/api/*', cors());

app.get('*', serveStatic({ root: './', manifest }));
app.get('/detail/*', serveStatic({ path: './index.html', manifest }));

app.get('/raw/:id', async (c) => {
  const id = c.req.param('id');
  const password = c.req.query('share_password');
  const res = await c.env.PB.getWithMetadata(id);
  if (!res.value) {
    return c.text('Not found', { status: 404 });
  }
  const content = res.value;
  const data: any = res.metadata;
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
  };
  const metadata: KVNamespacePutOptions = {
    metadata: {
      language: language || 'text',
      create_time: createTime,
    },
  };

  if (expire) {
    metadata.expirationTtl = expire;
  }
  if (isPrivate) {
    metadata.metadata.share_password = share_password || nanoid(10);
    pasteBody.share_password = metadata.metadata.share_password;
  }
  await c.env.PB.put(id, content, metadata);
  return c.json({ id, url: `${c.env.BASE_URL}/detail/${id}`, ...pasteBody });
});

// 获取paste
app.get('/api/get', async (c) => {
  const id = c.req.query('id');
  const password = c.req.query('share_password');
  const res = await c.env.PB.getWithMetadata(id as string);
  if (!res.value) {
    return c.json({ error: 'Not found' });
  }
  const content = res.value;
  const data: any = res.metadata;
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
  await c.env.BUCKET.put(id, await file.arrayBuffer(), {
    customMetadata: {
      name: file.name,
    },
  });
  return c.json({ id, url: `${c.env.BASE_URL}/file/${id}` });
});

// 反代文件
app.get('/file/:id', async (c) => {
  const id = c.req.param('id');
  const object = await c.env.BUCKET.get(id);
  if (!object) {
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

export default app;
