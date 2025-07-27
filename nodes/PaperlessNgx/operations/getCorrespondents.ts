import { z } from 'zod';
import { createPaperlessAxiosInstance } from './utils';

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
  const paperlessAxios = createPaperlessAxiosInstance();

  try {
    const url = `/api/correspondents/`;

    const response = await paperlessAxios.get(url);

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
