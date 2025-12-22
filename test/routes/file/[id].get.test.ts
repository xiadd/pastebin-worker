import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTestDB } from '../../utils';
import { files } from '../../../server/database/schema';
import fileGet from '../../../server/routes/file/[id].get';
import { getRouterParam } from 'nitro/h3';

// Mock nitro/h3
vi.mock('nitro/h3', async () => {
  return {
    defineHandler: (handler: any) => handler,
    getRouterParam: vi.fn(),
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

describe('file/[id].get', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    testDb.delete(files).run();
  });

  const createEvent = (getMock: any, deleteMock: any) => {
    return {
      context: {
        cloudflare: {
          env: {
            DB: {},
            BUCKET: {
              get: getMock,
              delete: deleteMock,
            },
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
              BUCKET: {
                get: getMock,
                delete: deleteMock,
              },
              BASE_URL: 'http://localhost',
             }
          }
        }
      }
    } as any;
  };

  it('should get a file', async () => {
    const id = 'test-id';
    const fileName = 'test.txt';
    const contentType = 'text/plain';
    
    await testDb.insert(files).values({
      id,
      content: fileName,
      createTime: Date.now(),
      metadata: JSON.stringify({}),
      language: 'text',
      expire: 0,
    });

    const mockObject = {
      body: 'file-stream',
      customMetadata: { name: fileName },
      httpMetadata: { contentType },
    };
    
    const getMock = vi.fn().mockResolvedValue(mockObject);
    const deleteMock = vi.fn();
    (getRouterParam as any).mockReturnValue(id);

    const event = createEvent(getMock, deleteMock);
    const result = await fileGet(event);

    expect(result).toBe('file-stream');
    expect(event.res.headers.get('Content-Disposition')).toContain(fileName);
    expect(event.res.headers.get('Content-Type')).toBe(contentType);
  });

  it('should return 404 if not found in DB', async () => {
    const getMock = vi.fn();
    const deleteMock = vi.fn();
    (getRouterParam as any).mockReturnValue('non-existent');

    const event = createEvent(getMock, deleteMock);
    const result = await fileGet(event);

    expect(event.res.status).toBe(404);
    expect(result).toBe('Not found');
  });

  it('should handle expired file', async () => {
    const id = 'expired-id';
    const createTime = Date.now() - 2000;
    const expire = 1;
    
    await testDb.insert(files).values({
      id,
      content: 'file',
      createTime,
      expire,
      metadata: JSON.stringify({}),
      language: 'text',
    });

    const getMock = vi.fn();
    const deleteMock = vi.fn();
    (getRouterParam as any).mockReturnValue(id);

    const event = createEvent(getMock, deleteMock);
    const result = await fileGet(event);

    expect(deleteMock).toHaveBeenCalledWith(id);
    expect(event.res.status).toBe(410);
    expect(result).toEqual({ error: 'File expired', code: 410 });
    
    // Should be deleted from DB
    const entries = testDb.select().from(files).all();
    expect(entries).toHaveLength(0);
  });

  it('should return 404 if found in DB but missing in R2', async () => {
    const id = 'missing-r2';
    
    await testDb.insert(files).values({
      id,
      content: 'file',
      createTime: Date.now(),
      expire: 0,
      metadata: JSON.stringify({}),
      language: 'text',
    });

    const getMock = vi.fn().mockResolvedValue(null);
    const deleteMock = vi.fn();
    (getRouterParam as any).mockReturnValue(id);

    const event = createEvent(getMock, deleteMock);
    const result = await fileGet(event);

    expect(event.res.status).toBe(404);
    expect(result).toBe('Not found');
    
    // Should be cleaned up from DB
    const entries = testDb.select().from(files).all();
    expect(entries).toHaveLength(0);
  });
});
