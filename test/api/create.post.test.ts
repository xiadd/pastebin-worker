import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTestDB } from '../utils';
import { pastes } from '../../server/database/schema';

// Mock nitro/h3 before importing the handler
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

import createPost from '../../server/api/create.post';
import { readBody } from 'nitro/h3';

describe('create.post', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    testDb.delete(pastes).run();
  });

  it('should create a new paste', async () => {
    const mockBody = {
      content: 'test content',
      language: 'javascript',
    };
    (readBody as any).mockResolvedValue(mockBody);

    const event = {
      context: {
        cloudflare: {
          env: {
            DB: {},
            BASE_URL: 'http://localhost',
          },
        },
      },
    } as any;

    const result = await createPost(event);

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('url');
    expect(result.content).toBe('test content');
    expect(result.language).toBe('javascript');

    // Verify DB
    const entries = testDb.select().from(pastes).all();
    expect(entries).toHaveLength(1);
    expect(entries[0].content).toBe('test content');
    expect(entries[0].language).toBe('javascript');
  });

  it('should return error if content is missing', async () => {
    (readBody as any).mockResolvedValue({});

    const event = {
      context: {
        cloudflare: {
          env: {
            DB: {},
            BASE_URL: 'http://localhost',
          },
        },
      },
    } as any;

    const result = await createPost(event);

    expect(result).toEqual({ error: 'Content is required' });
  });
});
