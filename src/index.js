import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/cloudflare-workers';

import { nanoid } from 'nanoid';

const app = new Hono();

app.use('/api/*', cors());

app.get('/*', serveStatic({ root: './' }));

app.post('/api/create', async (c) => {
  const { content } = await c.req.json();
  const id = nanoid();
  await c.env.PB.put(id, content);
  return c.json({ id });
});

app.get('/api/get', async (c) => {
  const id = c.req.query('id');
  const content = await c.env.PB.get(id);
  return c.json({ content });
});

app.get('/api/list', async (c) => {
  const keys = await c.env.PB.list();
  return c.json(keys);
});

export default app;
