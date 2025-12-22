import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTestDB } from '../utils';
import { pastes } from '../../server/database/schema';
import getGet from '../../server/api/get.get';
import { getQuery } from 'nitro/h3';

// Mock nitro/h3
vi.mock('nitro/h3', async () => {
  return {
    defineHandler: (handler: any) => handler,
    getQuery: vi.fn(),
  };
});

// Mock database
const testDb = createTestDB();
vi.mock('~/server/database', async () => {
  const actual = await vi.importActual('~/server/database');
  return {
    ...actual,
    createDB: vi.fn(() => testDb),
  };
});

describe('get.get', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    testDb.delete(pastes).run();
  });

  const createEvent = () => {
    return {
      context: {
        cloudflare: {
          env: {
            DB: {},
            BASE_URL: 'http://localhost',
          },
        },
      },
      res: {
        status: 200,
      },
      req: {
        runtime: {
          cloudflare: {
            env: {
              DB: {},
              BASE_URL: 'http://localhost',
            },
          },
        },
      },
    } as any;
  };

  it('should get a paste', async () => {
    const id = 'test-id';
    const content = 'test content';
    const metadata = { language: 'text', create_time: Date.now() };

    await testDb.insert(pastes).values({
      id,
      content,
      createTime: metadata.create_time,
      metadata: JSON.stringify(metadata),
      language: 'text',
      expire: 0,
    });

    (getQuery as any).mockReturnValue({ id });

    const result = await getGet(createEvent());

    expect(result).toHaveProperty('content', content);
    expect(result).toHaveProperty('url');
  });

  it('should return error if not found', async () => {
    (getQuery as any).mockReturnValue({ id: 'non-existent' });

    const result = await getGet(createEvent());

    expect(result).toEqual({ error: 'Not found' });
  });

  it('should handle expired paste', async () => {
    const id = 'expired-id';
    const createTime = Date.now() - 2000;
    const expire = 1; // 1 second, so it's expired
    const metadata = { language: 'text', create_time: createTime, expire };

    await testDb.insert(pastes).values({
      id,
      content: 'expired content',
      createTime,
      expire,
      metadata: JSON.stringify(metadata),
      language: 'text',
    });

    (getQuery as any).mockReturnValue({ id });

    const result = await getGet(createEvent());

    expect(result).toEqual({ error: 'Paste expired', code: 410 });

    // Check if deleted
    const entry = testDb
      .select()
      .from(pastes)
      .all()
      .find((p) => p.id === id);
    expect(entry).toBeUndefined();
  });

  it('should handle private paste with correct password', async () => {
    const id = 'private-id';
    const password = 'secret-pass';
    const metadata = {
      language: 'text',
      create_time: Date.now(),
      share_password: password,
    };

    await testDb.insert(pastes).values({
      id,
      content: 'private content',
      createTime: metadata.create_time,
      metadata: JSON.stringify(metadata),
      language: 'text',
      expire: 0,
    });

    (getQuery as any).mockReturnValue({ id, share_password: password });

    const result = await getGet(createEvent());

    expect(result).toHaveProperty('content', 'private content');
  });

  it('should reject private paste without password', async () => {
    const id = 'private-id-no-pass';
    const password = 'secret-pass';
    const metadata = {
      language: 'text',
      create_time: Date.now(),
      share_password: password,
    };

    await testDb.insert(pastes).values({
      id,
      content: 'private content',
      createTime: metadata.create_time,
      metadata: JSON.stringify(metadata),
      language: 'text',
      expire: 0,
    });

    (getQuery as any).mockReturnValue({ id });

    const event = createEvent();
    const result = await getGet(event);

    expect(result).toEqual({
      error: 'Private paste, please provide password',
      code: 403,
    });
    expect(event.res.status).toBe(403);
  });

  it('should reject private paste with wrong password', async () => {
    const id = 'private-id-wrong-pass';
    const password = 'secret-pass';
    const metadata = {
      language: 'text',
      create_time: Date.now(),
      share_password: password,
    };

    await testDb.insert(pastes).values({
      id,
      content: 'private content',
      createTime: metadata.create_time,
      metadata: JSON.stringify(metadata),
      language: 'text',
      expire: 0,
    });

    (getQuery as any).mockReturnValue({ id, share_password: 'wrong' });

    const event = createEvent();
    const result = await getGet(event);

    expect(result).toEqual({ error: 'Wrong password', code: 403 });
    expect(event.res.status).toBe(403);
  });
});
