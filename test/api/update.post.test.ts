import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTestDB } from '../utils';
import { pastes } from '../../server/database/schema';
import updatePost from '../../server/api/update.post';
import { readBody } from 'nitro/h3';

// Mock nitro/h3
vi.mock('nitro/h3', async () => {
  return {
    defineHandler: (handler: any) => handler,
    readBody: vi.fn(),
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

describe('update.post', () => {
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
             }
          }
        }
      }
    } as any;
  };

  it('should update a paste', async () => {
    const id = 'test-id';
    const content = 'original content';
    const edit_password = 'password';
    
    await testDb.insert(pastes).values({
      id,
      content,
      editPassword: edit_password,
      createTime: Date.now(),
      metadata: JSON.stringify({}),
      language: 'text',
      expire: 0,
    });

    const newContent = 'updated content';
    (readBody as any).mockResolvedValue({
      id,
      content: newContent,
      edit_password,
    });

    const result = await updatePost(createEvent());

    expect(result).toHaveProperty('url');
    
    const updated = testDb.select().from(pastes).all().find(p => p.id === id);
    expect(updated?.content).toBe(newContent);
  });

  it('should return error if fields are missing', async () => {
    (readBody as any).mockResolvedValue({});
    const result = await updatePost(createEvent());
    expect(result).toEqual({ error: 'Missing required fields: id, content, edit_password' });
  });

  it('should return error if not found', async () => {
    (readBody as any).mockResolvedValue({
      id: 'non-existent',
      content: 'new',
      edit_password: 'pwd',
    });
    const result = await updatePost(createEvent());
    expect(result).toEqual({ error: 'Not found' });
  });

  it('should return error if password is wrong', async () => {
    const id = 'test-id';
    await testDb.insert(pastes).values({
      id,
      content: 'content',
      editPassword: 'correct-password',
      createTime: Date.now(),
      metadata: JSON.stringify({}),
      language: 'text',
      expire: 0,
    });

    (readBody as any).mockResolvedValue({
      id,
      content: 'new',
      edit_password: 'wrong-password',
    });

    const event = createEvent();
    const result = await updatePost(event);
    
    expect(event.res.status).toBe(403);
    expect(result).toEqual({ error: 'Wrong password', code: 403 });
  });
});
