import axios from 'axios';
import process from 'node:process';
import { z } from 'zod';
import { paperlessTagSchema } from './utils';

const resultSchema = z.object({
	tags: z.array(paperlessTagSchema),
	total: z.number(),
});

const paperlessTagsResponseSchema = z.object({
	count: z.number(),
	results: z.array(paperlessTagSchema),
});

export async function getTags() {
	const paperlessUrl = process.env.PAPERLESS_NGX_URL;
	const paperlessToken = process.env.PAPERLESS_NGX_TOKEN;

	if (!paperlessUrl || !paperlessToken) {
		throw new Error('PAPERLESS_NGX_URL and PAPERLESS_NGX_TOKEN must be set');
	}

	try {
		const url = `${paperlessUrl}/api/tags/`;

		const response = await axios.get(url, {
			headers: {
				Authorization: `Token ${paperlessToken}`,
			},
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
		if (axios.isAxiosError(error)) {
			console.error(
				'Error fetching tags from Paperless NGX:',
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
