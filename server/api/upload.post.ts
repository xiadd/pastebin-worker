import { defineHandler } from 'nitro/h3';
import { createDB, files, type NewFile } from '../database';
import { nanoid } from '../utils/nanoid';
import { MAX_SIZE, FILE_EXPIRE_SECONDS, FILE_EXPIRE_DAYS } from '../utils/constants';

export default defineHandler(async (event) => {
  const formData = await event.req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return { error: 'File is required' };
  }
  if (file.size > MAX_SIZE) {
    event.res.status = 413;
    return { error: 'File is too large' };
  }

  const id = nanoid();
  const createTime = Date.now();

  const cloudflare = event.context.cloudflare || event.req?.runtime?.cloudflare;

  // Store file in R2
  await cloudflare.env.BUCKET.put(id, await file.arrayBuffer(), {
    customMetadata: {
      name: file.name,
      size: file.size.toString(),
      type: file.type,
    },
  });

  // Store file record in database
  const db = createDB(cloudflare.env.DB);
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

  return {
    id,
    url: `${cloudflare.env.BASE_URL}/file/${id}`,
    expireTime: createTime + FILE_EXPIRE_SECONDS * 1000,
    expireDays: FILE_EXPIRE_DAYS,
  };
});
