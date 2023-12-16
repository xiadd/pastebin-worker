import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/cloudflare-workers';

import { nanoid } from 'nanoid';

const app = new Hono();

app.use('/api/*', cors());

app.notFound((c) => c.json({ error: 'Not found' }));

app.get('/*', serveStatic({ root: './' }));
app.get('/detail/*', serveStatic({ path: './index.html' }));

app.get('/raw/:id', async (c) => {
  const id = c.req.param('id');
  const password = c.req.query('password');
  const res = await c.env.PB.get(id);
  if (!res) {
    return c.text('Not found');
  }
  const data = JSON.parse(res);
  if (data.share_password) {
    if (!password) {
      return c.text('Private paste, please provide password');
    }
  }
  return c.text(data.content);
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
  const pasteBody = {
    content,
    expire: expire || 0,
    language: language || 'text',
    create_time: createTime,
  };
  const metadata = {};

  if (expire) {
    metadata.expirationTtl = expire;
  }
  if (isPrivate) {
    pasteBody.share_password = share_password || nanoid();
  }
  await c.env.PB.put(id, JSON.stringify(pasteBody), metadata);
  return c.json({ id, ...pasteBody });
});

// 获取paste
app.get('/api/get', async (c) => {
  const id = c.req.query('id');
  const password = c.req.query('share_password');
  const res = await c.env.PB.get(id);
  if (!res) {
    return c.json({ error: 'Not found' });
  }
  const data = JSON.parse(res);
  if (data.share_password) {
    if (!password) {
      return c.json({ error: 'Private paste, please provide password' });
    }
    if (password !== data.share_password) {
      return c.json({ error: 'Wrong password' });
    }
  }
  return c.json({ content: data.content });
});

// 列出所有paste的key
app.get('/api/list', async (c) => {
  const keys = await c.env.PB.list();
  return c.json(keys);
});

// 上传图片
app.post('/api/upload', async (c) => {
  const { file } = await c.req.parseBody();
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('https://telegra.ph/upload', {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  const src = data[0].src;
  const id = nanoid();
  const metadata = {
    expirationTtl: 86400,
  };
  await c.env.PBIMGS.put(id, src, metadata);
  return c.json({ id, src });
});

// 反代图片
app.get('/file/:id', async (c) => {
  const id = c.req.param('id');
  const res = await c.env.PBIMGS.get(id);
  if (!res) {
    return c.text('Not found');
  }
  const data = await fetch(`https://telegra.ph${res}`);
  return data;
});

export default app;
