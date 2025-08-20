import { z } from 'zod';
import { createPaperlessAxiosInstance, getMap, paperlessTagSchema } from './utils';
import axios from 'axios';

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
  correspondent?: string | null;
};

export async function updateDocument(documentId: number, data: UpdateData) {
  const paperlessAxios = createPaperlessAxiosInstance();

  try {
    const allTagsMap = await getMap(
      paperlessAxios,
      `/api/tags/`,
      z.array(paperlessTagSchema),
    );
    const tagNameToIdMap = new Map(
      Array.from(allTagsMap, ([id, name]) => [name, id]) as [
        string,
        number,
      ][],
    );

    const docUrl = `/api/documents/${documentId}/`;
    const currentDocResponse = await paperlessAxios.get(docUrl);
    const currentDoc = paperlessDocumentSchema.parse(currentDocResponse.data);

    const updatePayload: { title?: string; tags?: number[]; correspondent?: number | null } = {};

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

    // Handle correspondent: set by name, create if it doesn't exist
    if (data.hasOwnProperty('correspondent') && data.correspondent !== '') {
      if (data.correspondent === null) {
        // Setting correspondent to null removes the current correspondent
        updatePayload.correspondent = null;
      } else if (typeof data.correspondent === 'string') {
        // Fetch all correspondents from Paperless
        const allCorrespondents = await getMap(
          paperlessAxios,
          `/api/correspondents/`,
          z.array(z.object({ id: z.number(), name: z.string() })),
        );

        // Find the id of the given correspondent using case-insensitive search
        let correspondentId = undefined;
        for (const correspondent of allCorrespondents) {
          if (correspondent[1].toLowerCase().trim() === data.correspondent.toLowerCase().trim()) {
            correspondentId = correspondent[0];
            break;
          }
        }

        if (correspondentId === undefined) {
          // Create the correspondent if it does not exist yet
          const createResp = await paperlessAxios.post(`/api/correspondents/`, {
            name: data.correspondent,
          });
          const created = z.object({ id: z.number() }).parse(createResp.data);
          correspondentId = created.id;
        }

        updatePayload.correspondent = correspondentId;
      }
    }

    const response = await paperlessAxios.patch(docUrl, updatePayload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const updatedDoc = paperlessDocumentSchema.parse(response.data);

    const correspondentMap = await getMap(
      paperlessAxios,
      `/api/correspondents/`,
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
