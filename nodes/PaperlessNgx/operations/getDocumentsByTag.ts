import axios from 'axios';
import process from 'node:process';
import { z } from 'zod';
import { getMap, paperlessTagSchema } from './utils';

const resultSchema = z.object({
  documents: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      tags: z.array(z.string()),
      correspondent: z.string().nullable(),
      content: z.string().nullable(),
    }),
  ),
  total: z.number(),
});

// Internal schemas for data from Paperless API
const paperlessCorrespondentSchema = z.object({
  id: z.number(),
  name: z.string(),
});

const paperlessDocumentSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string().optional(),
  tags: z.array(z.number()),
  correspondent: z.number().nullable(),
});

const paperlessDocumentsResponseSchema = z.object({
  count: z.number(),
  results: z.array(paperlessDocumentSchema),
});

export async function getDocumentsByTag(tags: string[], limit = 10) {
  const paperlessUrl = process.env.PAPERLESS_NGX_URL;
  const paperlessToken = process.env.PAPERLESS_NGX_TOKEN;

  if (!paperlessUrl || !paperlessToken) {
    throw new Error('PAPERLESS_NGX_URL and PAPERLESS_NGX_TOKEN must be set');
  }

  try {
    // To filter by tag name, we first need to get the tag IDs.
    const allTagsMap = await getMap(
      `${paperlessUrl}/api/tags/`,
      paperlessToken,
      z.array(paperlessTagSchema),
    );
    const tagNameToIdMap = new Map(
      Array.from(allTagsMap, ([id, name]) => [name, id]) as [
        string,
        number,
      ][],
    );

    const tagIds = tags
      .map((name) => tagNameToIdMap.get(name))
      .filter((id) => id !== undefined);

    // If any tag name doesn't exist, the intersection of all tags will be empty.
    if (tagIds.length !== tags.length) {
      return { documents: [], total: 0 };
    }

    const [correspondentMap] = await Promise.all([
      getMap(
        `${paperlessUrl}/api/correspondents/`,
        paperlessToken,
        z.array(paperlessCorrespondentSchema),
      ),
    ]);

    const url = `${paperlessUrl}/api/documents/`;
    const params: { page_size: number; tags__id__all?: string } = {
      page_size: limit,
    };
    if (tagIds.length > 0) {
      params.tags__id__all = tagIds.join(',');
    }

    const response = await axios.get(url, {
      headers: {
        Authorization: `Token ${paperlessToken}`,
      },
      params,
    });

    const parsedResponse = paperlessDocumentsResponseSchema.parse(response.data);

    const documents = parsedResponse.results.map((doc) => {
      const tagNames = doc.tags.map(
        (tagId) => allTagsMap.get(tagId) ?? `Unknown Tag (${tagId})`,
      );
      return {
        id: doc.id,
        title: doc.title,
        tags: tagNames,
        correspondent: doc.correspondent
          ? correspondentMap.get(doc.correspondent) ??
          `Unknown Correspondent (${doc.correspondent})`
          : null,
        content: doc.content ?? null,
      };
    });

    const result = {
      documents,
      total: documents.length,
    };

    return resultSchema.parse(result);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Error fetching documents from Paperless NGX:',
        error.response?.data || error.message,
      );
    } else if (error instanceof z.ZodError) {
      console.error('Zod validation error:', error.issues);
    } else {
      console.error('An unexpected error occurred:', error);
    }
    // Re-throw to indicate failure in tests
    throw error;
  }
}
