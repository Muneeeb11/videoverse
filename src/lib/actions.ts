'use server';

import { suggestVideoTags, type SuggestVideoTagsInput } from '@/ai/flows/suggest-video-tags';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1, { message: 'Title is required.' }),
  description: z.string().min(1, { message: 'Description is required.' }),
});

export async function handleSuggestTags(prevState: any, formData: FormData) {
  try {
    const validatedFields = schema.safeParse({
      title: formData.get('title'),
      description: formData.get('description'),
    });
    
    if (!validatedFields.success) {
      return {
        message: 'Please provide a title and description.',
        tags: [],
        error: true,
      };
    }

    const input: SuggestVideoTagsInput = {
      title: validatedFields.data.title,
      description: validatedFields.data.description,
    };
    
    const result = await suggestVideoTags(input);

    return {
      message: 'Tags suggested successfully.',
      tags: result.tags,
      error: false,
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'An error occurred while suggesting tags.',
      tags: [],
      error: true,
    };
  }
}
