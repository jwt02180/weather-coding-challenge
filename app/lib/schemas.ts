import { z } from 'zod';

export const zipCodeSchema = z.object({
	zip: z
		.string()
		.trim()
		.min(5, 'Please enter 5 digits')
		.max(5, 'Please enter 5 digits')
		.regex(/^\d+$/, 'Please enter 5 digits')
});