import { defineHandler, getRouterParam } from 'nitro/h3';
import { eq } from 'drizzle-orm';
import { createDB, files } from '~/server/database';

export default defineHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  const cloudflare = event.context.cloudflare || event.req?.runtime?.cloudflare;
  const db = createDB(cloudflare.env.DB);

  // Check file record in database
  const fileRecord = await db
    .select()
    .from(files)
    .where(eq(files.id, id!))
    .get();

  if (!fileRecord) {
    event.res.status = 404;
    return 'Not found';
  }

  // Check if file has expired
  if (
    fileRecord.expire &&
    Date.now() > fileRecord.createTime + fileRecord.expire * 1000
  ) {
    // Delete expired file from R2 and database
    await cloudflare.env.BUCKET.delete(id!);
    await db.delete(files).where(eq(files.id, id!));
    event.res.status = 410;
    return { error: 'File expired', code: 410 };
  }

  // Get file from R2
  const object = await cloudflare.env.BUCKET.get(id!);
  if (!object) {
    // File not found in R2, clean up database record
    await db.delete(files).where(eq(files.id, id!));
    event.res.status = 404;
    return 'Not found';
  }

  // Set response headers
  const fileName = object.customMetadata?.name || 'file';
  event.res.headers.set(
    'Content-Disposition',
    `inline; filename="${encodeURIComponent(fileName)}"`,
  );

  // Copy HTTP metadata from R2 object
  if (object.httpMetadata?.contentType) {
    event.res.headers.set('Content-Type', object.httpMetadata.contentType);
  }
  if (object.httpMetadata?.cacheControl) {
    event.res.headers.set('Cache-Control', object.httpMetadata.cacheControl);
  }
  if (object.httpMetadata?.contentEncoding) {
    event.res.headers.set(
      'Content-Encoding',
      object.httpMetadata.contentEncoding,
    );
  }
  if (object.httpMetadata?.contentLanguage) {
    event.res.headers.set(
      'Content-Language',
      object.httpMetadata.contentLanguage,
    );
  }

  // Send the stream
  return object.body as ReadableStream;
});
