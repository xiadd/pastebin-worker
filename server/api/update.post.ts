import { defineHandler, readBody } from 'nitro/h3';
import { eq } from 'drizzle-orm';
import { createDB, pastes } from '../database';

interface UpdatePasteBody {
  id: string;
  content: string;
  edit_password: string;
}

export default defineHandler(async (event) => {
  const body = await readBody<UpdatePasteBody>(event);
  
  if (!body || !body.id || !body.content || !body.edit_password) {
    return { error: 'Missing required fields: id, content, edit_password' };
  }
  
  const { id, content, edit_password } = body;

  if (!content) {
    return { error: 'Content is required' };
  }

  const cloudflare = event.context.cloudflare || event.req?.runtime?.cloudflare;
  const db = createDB(cloudflare.env.DB);
  const result = await db.select().from(pastes).where(eq(pastes.id, id)).get();

  if (!result) {
    return { error: 'Not found' };
  }

  if (result.editPassword !== edit_password) {
    event.res.status = 403;
    return { error: 'Wrong password', code: 403 };
  }

  await db.update(pastes).set({ content }).where(eq(pastes.id, id));
  return { url: `${cloudflare.env.BASE_URL}/detail/${id}`, ...result };
});
