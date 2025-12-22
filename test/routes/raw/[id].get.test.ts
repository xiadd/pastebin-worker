import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTestDB } from '../../utils';
import { pastes } from '../../../server/database/schema';
import rawGet from '../../../server/routes/raw/[id].get';
import { getRouterParam, getQuery } from 'nitro/h3';

// Mock nitro/h3
vi.mock('nitro/h3', async () => {
  return {
    defineHandler: (handler: any) => handler,
    getRouterParam: vi.fn(),
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

describe('raw/[id].get', () => {
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
        headers: new Map(),
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

  it('should return raw content', async () => {
    const id = 'test-id';
    const content = 'test content';
    
    await testDb.insert(pastes).values({
      id,
      content,
      createTime: Date.now(),
      metadata: JSON.stringify({}),
      language: 'text',
      expire: 0,
    });

    (getRouterParam as any).mockReturnValue(id);
    (getQuery as any).mockReturnValue({});

    const result = await rawGet(createEvent());

    expect(result).toBe(content);
  });

  it('should return 404 if not found', async () => {
    (getRouterParam as any).mockReturnValue('non-existent');
    (getQuery as any).mockReturnValue({});

    const event = createEvent();
    const result = await rawGet(event);

    expect(event.res.status).toBe(404);
    expect(result).toBe('Not found');
  });

  it('should check password', async () => {
    const id = 'test-id';
    const content = 'test content';
    const share_password = 'secret';
    
    await testDb.insert(pastes).values({
      id,
      content,
      createTime: Date.now(),
      metadata: JSON.stringify({ share_password }),
      language: 'text',
      expire: 0,
    });

    (getRouterParam as any).mockReturnValue(id);
    
    // No password provided
    (getQuery as any).mockReturnValue({});
    let event = createEvent();
    let result = await rawGet(event);
    expect(event.res.status).toBe(403);
    expect(result).toBe('Private paste, please provide password');

    // Wrong password
    (getQuery as any).mockReturnValue({ share_password: 'wrong' });
    event = createEvent();
    result = await rawGet(event);
    expect(event.res.status).toBe(403);
    expect(result).toBe('Wrong password');

    // Correct password
    (getQuery as any).mockReturnValue({ share_password });
    event = createEvent();
    result = await rawGet(event);
    expect(result).toBe(content);
  });
});
