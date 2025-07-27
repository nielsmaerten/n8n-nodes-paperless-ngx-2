import { z } from 'zod';
import { createPaperlessAxiosInstance, paperlessTagSchema } from './utils';

const resultSchema = z.object({
	tags: z.array(paperlessTagSchema),
	total: z.number(),
});

const paperlessTagsResponseSchema = z.object({
	count: z.number(),
	results: z.array(paperlessTagSchema),
});

export async function getTags() {
	const paperlessAxios = createPaperlessAxiosInstance();

	try {
		const url = `/api/tags/`;

		const response = await paperlessAxios.get(url, {
			params: {
				page_size: 1000,
			},
		});

		const parsedResponse = paperlessTagsResponseSchema.parse(response.data);

		const result = {
			tags: parsedResponse.results,
			total: parsedResponse.count,
		};

		return resultSchema.parse(result);
	} catch (error) {
		if (error instanceof z.ZodError) {
			console.error('Zod validation error:', error.issues);
		} else {
			console.error('An unexpected error occurred:', error);
		}
		// Re-throw to indicate failure in tests
		throw error;
	}
}
