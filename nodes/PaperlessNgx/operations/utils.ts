import axios, { type AxiosInstance } from 'axios';
import process from 'node:process';
import { z } from 'zod';

export const paperlessTagSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  color: z.string(),
  text_color: z.string(),
  is_inbox_tag: z.boolean(),
  document_count: z.number(),
});

export function createPaperlessAxiosInstance(): AxiosInstance {
  const paperlessUrl = process.env.PAPERLESS_NGX_URL;
  const paperlessToken = process.env.PAPERLESS_NGX_TOKEN;

  if (!paperlessUrl || !paperlessToken) {
    throw new Error('PAPERLESS_NGX_URL and PAPERLESS_NGX_TOKEN must be set');
  }

  return axios.create({
    baseURL: paperlessUrl,
    headers: {
      Authorization: `Token ${paperlessToken}`,
    },
  });
}

export async function getMap(
  axiosInstance: AxiosInstance,
  path: string,
  schema: z.ZodSchema<any[]>,
) {
  // Note: This doesn't handle pagination. Assumes all items are on the first page.
  const response = await axiosInstance.get(path, {
    params: { page_size: 1000 },
  });
  const items = schema.parse(response.data.results);
  return new Map(
    items.map((item: { id: number; name: string }) => [item.id, item.name]),
  );
}
