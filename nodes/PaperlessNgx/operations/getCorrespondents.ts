import axios from 'axios';
import process from 'node:process';
import { z } from 'zod';

const paperlessCorrespondentSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  document_count: z.number(),
});

const resultSchema = z.object({
  correspondents: z.array(paperlessCorrespondentSchema),
  total: z.number(),
});

const paperlessCorrespondentsResponseSchema = z.object({
  count: z.number(),
  results: z.array(paperlessCorrespondentSchema),
});

export async function getCorrespondents() {
  const paperlessUrl = process.env.PAPERLESS_NGX_URL;
  const paperlessToken = process.env.PAPERLESS_NGX_TOKEN;

  if (!paperlessUrl || !paperlessToken) {
    throw new Error('PAPERLESS_NGX_URL and PAPERLESS_NGX_TOKEN must be set');
  }

  try {
    const url = `${paperlessUrl}/api/correspondents/`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Token ${paperlessToken}`,
      },
    });

    const validatedResponse = paperlessCorrespondentsResponseSchema.parse(response.data);

    const correspondents = validatedResponse.results.map((correspondent) => ({
      id: correspondent.id,
      name: correspondent.name,
      slug: correspondent.slug,
      document_count: correspondent.document_count,
    }));

    const result = {
      correspondents,
      total: validatedResponse.count,
    };

    return resultSchema.parse(result);

  } catch (error) {
    console.error(error);
    throw new Error('Failed to get correspondents');
  }
}
