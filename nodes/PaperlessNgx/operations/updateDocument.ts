import axios from 'axios';
import process from 'node:process';
import { z } from 'zod';
import { getMap, paperlessTagSchema } from './utils';

const paperlessDocumentSchema = z.object({
  id: z.number(),
  title: z.string(),
  tags: z.array(z.number()),
  correspondent: z.number().nullable(),
  content: z.string().nullable(),
});

const resultSchema = z.object({
  id: z.number(),
  title: z.string(),
  tags: z.array(z.string()),
  correspondent: z.string().nullable(),
});

type UpdateData = {
  title?: string;
  tags?: string[];
  removeTags?: string[];
};

export async function updateDocument(documentId: number, data: UpdateData) {
  const paperlessUrl = process.env.PAPERLESS_NGX_URL;
  const paperlessToken = process.env.PAPERLESS_NGX_TOKEN;

  if (!paperlessUrl || !paperlessToken) {
    throw new Error('PAPERLESS_NGX_URL and PAPERLESS_NGX_TOKEN must be set');
  }

  try {
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

    const docUrl = `${paperlessUrl}/api/documents/${documentId}/`;
    const currentDocResponse = await axios.get(docUrl, {
      headers: { Authorization: `Token ${paperlessToken}` },
    });
    const currentDoc = paperlessDocumentSchema.parse(currentDocResponse.data);

    const updatePayload: { title?: string; tags?: number[] } = {};

    if (data.title) {
      updatePayload.title = data.title;
    }

    let finalTagIds = new Set(currentDoc.tags);

    if (data.tags) {
      for (const tagName of data.tags) {
        const tagId = tagNameToIdMap.get(tagName);
        if (tagId === undefined) {
          throw new Error(`Tag "${tagName}" not found in Paperless-ngx.`);
        }
        finalTagIds.add(tagId);
      }
    }

    if (data.removeTags) {
      for (const tagName of data.removeTags) {
        const tagId = tagNameToIdMap.get(tagName);
        if (tagId !== undefined) {
          finalTagIds.delete(tagId);
        }
      }
    }

    updatePayload.tags = Array.from(finalTagIds);

    const response = await axios.patch(docUrl, updatePayload, {
      headers: {
        Authorization: `Token ${paperlessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const updatedDoc = paperlessDocumentSchema.parse(response.data);

    const correspondentMap = await getMap(
      `${paperlessUrl}/api/correspondents/`,
      paperlessToken,
      z.array(z.object({ id: z.number(), name: z.string() })),
    );

    const result = {
      id: updatedDoc.id,
      title: updatedDoc.title,
      tags: updatedDoc.tags.map(
        (tagId) => allTagsMap.get(tagId) ?? `Unknown Tag (${tagId})`,
      ),
      correspondent: updatedDoc.correspondent
        ? correspondentMap.get(updatedDoc.correspondent) ??
        `Unknown Correspondent (${updatedDoc.correspondent})`
        : null,
    };

    return resultSchema.parse(result);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Error updating document in Paperless NGX:',
        error.response?.data || error.message,
      );
    } else if (error instanceof z.ZodError) {
      console.error('Zod validation error:', error.issues);
    } else {
      console.error('An unexpected error occurred:', error);
    }
    throw error;
  }
}
