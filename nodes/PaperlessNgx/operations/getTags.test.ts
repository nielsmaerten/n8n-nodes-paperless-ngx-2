import { describe, it, expect } from 'vitest';
import { getTags } from './getTags';
import * as dotenv from 'dotenv';

dotenv.config();

describe('getTags', () => {
  it('should return all tags', async () => {
    const result = await getTags();

    expect(result.tags).toBeInstanceOf(Array);
    expect(result.total).toBeGreaterThan(0);

    // Check that every tag a name and an ID.
    for (const tag of result.tags) {
      expect(tag).toHaveProperty('name');
      expect(tag).toHaveProperty('id');
      expect(typeof tag.name).toBe('string');
      expect(typeof tag.id).toBe('number');
    }
  });
});
