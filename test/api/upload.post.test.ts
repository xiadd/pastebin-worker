import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTestDB } from '../utils';
import { files } from '../../server/database/schema';
import uploadPost from '../../server/api/upload.post';
import { MAX_SIZE, FILE_EXPIRE_SECONDS } from '../../server/utils/constants';

// Mock nitro/h3
vi.mock('nitro/h3', async () => {
  return {
    defineHandler: (handler: any) => handler,
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

describe('upload.post', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    testDb.delete(files).run();
  });

  const createEvent = (formDataMock: any, putMock: any) => {
    return {
      req: {
        formData: vi.fn().mockResolvedValue(formDataMock),
        runtime: {
          cloudflare: {
            env: {
              DB: {},
              BUCKET: {
                put: putMock,
              },
              BASE_URL: 'http://localhost',
            },
          },
        },
      },
      context: {
        cloudflare: {
          env: {
            DB: {},
            BUCKET: {
              put: putMock,
            },
            BASE_URL: 'http://localhost',
          },
        },
      },
      res: {
        status: 200,
      },
    } as any;
  };

  it('should upload a file', async () => {
    const putMock = vi.fn();
    const fileMock = {
      name: 'test.txt',
      size: 1024,
      type: 'text/plain',
      arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(10)),
    };

    const formDataMock = {
      get: vi.fn().mockReturnValue(fileMock),
    };

    const result = await uploadPost(createEvent(formDataMock, putMock));

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('url');
    expect(putMock).toHaveBeenCalled();

    // Verify DB
    const entries = testDb.select().from(files).all();
    expect(entries).toHaveLength(1);
    expect(entries[0].content).toBe('test.txt');
    expect(entries[0].language).toBe('text/plain');
  });

  it('should return error if file is missing', async () => {
    const putMock = vi.fn();
    const formDataMock = {
      get: vi.fn().mockReturnValue(null),
    };

    const result = await uploadPost(createEvent(formDataMock, putMock));
    expect(result).toEqual({ error: 'File is required' });
  });

  it('should return error if file is too large', async () => {
    const putMock = vi.fn();
    const fileMock = {
      name: 'large.txt',
      size: MAX_SIZE + 1,
      type: 'text/plain',
      arrayBuffer: vi.fn(),
    };

    const formDataMock = {
      get: vi.fn().mockReturnValue(fileMock),
    };

    const event = createEvent(formDataMock, putMock);
    const result = await uploadPost(event);

    expect(event.res.status).toBe(413);
    expect(result).toEqual({ error: 'File is too large' });
  });
});
