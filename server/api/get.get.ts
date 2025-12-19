import { defineHandler, getQuery } from 'nitro/h3';
import { eq } from 'drizzle-orm';
import { createDB, pastes } from '../database';

export default defineHandler(async (event) => {
  const query = getQuery(event);
  const id = query.id as string;
  const password = query.share_password as string;

  const cloudflare = event.context.cloudflare || event.req?.runtime?.cloudflare;
  const db = createDB(cloudflare.env.DB);
  const result = await db.select().from(pastes).where(eq(pastes.id, id!)).get();

  if (!result) {
    return { error: 'Not found' };
  }

  if (result.expire && Date.now() > result.createTime + result.expire * 1000) {
    await db.delete(pastes).where(eq(pastes.id, id!));
    return { error: 'Paste expired', code: 410 };
  }

  const content = result.content;
  const data: any = JSON.parse(result.metadata);
  if (data.share_password) {
    if (!password) {
      event.res.status = 403;
      return {
        error: 'Private paste, please provide password',
        code: 403,
      };
    }
    if (password !== data.share_password) {
      event.res.status = 403;
      return { error: 'Wrong password', code: 403 };
    }
  }
  return {
    content: content,
    url: `${cloudflare.env.BASE_URL}/detail/${id}`,
    ...data,
  };
});
