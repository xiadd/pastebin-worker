import { defineHandler, getRouterParam, getQuery } from 'nitro/h3';
import { eq } from 'drizzle-orm';
import { createDB, pastes } from '../../database';

export default defineHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const query = getQuery(event);
  const password = query.share_password as string;

  const cloudflare = event.context.cloudflare || event.req?.runtime?.cloudflare;
  const db = createDB(cloudflare.env.DB);

  const res = await db.select().from(pastes).where(eq(pastes.id, id!)).get();
  if (!res) {
    event.res.status = 404;
    return 'Not found';
  }

  const content = res.content;
  const data: any = JSON.parse(res.metadata);
  if (data.share_password) {
    if (!password) {
      event.res.status = 403;
      return 'Private paste, please provide password';
    }
  }
  if (password !== data.share_password) {
    event.res.status = 403;
    return 'Wrong password';
  }

  event.res.headers.set('Content-Type', 'text/plain; charset=utf-8');
  return content || '';
});
