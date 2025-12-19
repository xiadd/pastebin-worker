import { defineHandler, readBody } from 'nitro/h3';
import { createDB, pastes, type NewPaste } from '~/server/database';
import { nanoid } from '~/server/utils/nanoid';

interface CreateRequestBody {
  content: string;
  expire?: number;
  isPrivate?: boolean;
  language?: string;
  share_password?: string;
}

export default defineHandler(async (event) => {
  const body = await readBody<CreateRequestBody>(event);
  const { 
    content, 
    expire, 
    isPrivate, 
    language, 
    share_password 
  } = body ?? {};

  if (!content) {
    return { error: 'Content is required' };
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

  const cloudflare = event.context.cloudflare || event.req?.runtime?.cloudflare;
  const db = createDB(cloudflare.env.DB);
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
  return { id, url: `${cloudflare.env.BASE_URL}/detail/${id}`, ...pasteBody };
});
