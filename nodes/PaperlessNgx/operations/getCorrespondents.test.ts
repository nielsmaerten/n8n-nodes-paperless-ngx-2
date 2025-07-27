import { describe, it, expect } from 'vitest';
import { getCorrespondents } from './getCorrespondents';
import * as dotenv from 'dotenv';

dotenv.config();

describe('getCorrespondents', () => {
  it('should return all correspondents', async () => {
    const result = await getCorrespondents();

    expect(result.correspondents).toBeInstanceOf(Array);
    expect(result.total).toBeGreaterThan(0);

    // Check that every correspondent has a name and an ID.
    for (const correspondent of result.correspondents) {
      expect(correspondent).toHaveProperty('name');
      expect(correspondent).toHaveProperty('id');
      expect(typeof correspondent.name).toBe('string');
      expect(typeof correspondent.id).toBe('number');
    }
  });
});
