import { describe, it, expect } from 'vitest';
import { getDocumentsByTag } from './getDocumentsByTag';
import * as dotenv from 'dotenv';

dotenv.config();

describe('getDocumentsByTag', () => {
  it('should return documents with the specified tag', async () => {
    const tags = ['inbox'];
    const result = await getDocumentsByTag(tags);

    expect(result.documents).toBeInstanceOf(Array);
    expect(result.total).toBeGreaterThan(0);

    // Check that all of the returned documents have the 'inbox' tag.
    const hasInboxTag = result.documents.every((doc) =>
      doc.tags.includes('inbox'),
    );
    expect(hasInboxTag).toBe(true);
  });

  it('should return an empty array if no documents are found', async () => {
    const tags = ['nonexistent-tag'];
    const result = await getDocumentsByTag(tags);

    expect(result.documents).toEqual([]);
    expect(result.total).toBe(0);
  });
});
