import { describe, it, expect } from 'vitest';
import { updateDocument } from './updateDocument';
import * as dotenv from 'dotenv';

const TEST_DOCUMENT_ID = 1426; // Example document ID for testing

dotenv.config();

describe('updateDocument', () => {
  it('should set a title on a document', async () => {
    const documentId = TEST_DOCUMENT_ID;
    const newTitle = 'Updated Document Title';

    const result = await updateDocument(documentId, { title: newTitle });

    expect(result).toEqual(
      expect.objectContaining({
        id: documentId,
        title: newTitle,
      }),
    );
  });

  it('should set tags on a document', async () => {
    const documentId = TEST_DOCUMENT_ID;
    const newTags = ['paperless-gpt-auto'];

    // Note: the tag should already exist in Paperless NGX.
    // If it doesn't, updateDocument should throw an error.

    const result = await updateDocument(documentId, { tags: newTags });

    expect(result).toEqual(
      expect.objectContaining({
        id: documentId,
        tags: expect.arrayContaining(newTags),
      }),
    );
  });

  it('should remove a tag from a document', async () => {
    const documentId = TEST_DOCUMENT_ID;
    const tagToRemove = 'paperless-gpt-auto';

    const result = await updateDocument(documentId, { removeTags: [tagToRemove] });

    expect(result).toEqual(
      expect.objectContaining({
        id: documentId,
        tags: expect.not.arrayContaining([tagToRemove]),
      }),
    );
  });
});
