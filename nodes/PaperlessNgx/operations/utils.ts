import axios from 'axios';
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

export async function getMap(
  url: string,
  token: string,
  schema: z.ZodSchema<any[]>,
) {
  // Note: This doesn't handle pagination. Assumes all items are on the first page.
  const response = await axios.get(url, {
    headers: { Authorization: `Token ${token}` },
    params: { page_size: 1000 },
  });
  const items = schema.parse(response.data.results);
  return new Map(
    items.map((item: { id: number; name: string }) => [item.id, item.name]),
  );
}
