'use server';

/**
 * @fileOverview AI flow for suggesting video tags based on video title and description.
 *
 * - suggestVideoTags - Function to generate tag suggestions for a video.
 * - SuggestVideoTagsInput - Input type for suggestVideoTags function.
 * - SuggestVideoTagsOutput - Output type for suggestVideoTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestVideoTagsInputSchema = z.object({
  title: z.string().describe('The title of the video.'),
  description: z.string().describe('The description of the video.'),
});
export type SuggestVideoTagsInput = z.infer<typeof SuggestVideoTagsInputSchema>;

const SuggestVideoTagsOutputSchema = z.object({
  tags: z.array(z.string()).describe('An array of suggested tags for the video.'),
});
export type SuggestVideoTagsOutput = z.infer<typeof SuggestVideoTagsOutputSchema>;


const TagAppropriatenessInputSchema = z.object({
  tag: z.string().describe('A suggested tag for the video.'),
  title: z.string().describe('The title of the video.'),
  description: z.string().describe('The description of the video.'),
});

const TagAppropriatenessOutputSchema = z.object({
  appropriate: z.boolean().describe('Whether the tag is appropriate for the video.'),
  reason: z.string().optional().describe('Reasoning for the appropriateness decision')
});

const isTagAppropriate = ai.defineTool({
  name: 'isTagAppropriate',
  description: 'Determines whether a given tag is appropriate for a video based on its title and description.',
  inputSchema: TagAppropriatenessInputSchema,
  outputSchema: TagAppropriatenessOutputSchema,
}, async (input) => {
  // Basic implementation - can be expanded with more sophisticated logic.
  // For example, call an LLM or use an embedding similarity search.
  const {tag, title, description} = input;
  const combinedText = `${title} ${description}`.toLowerCase();
  const tagLower = tag.toLowerCase();
  const appropriate = combinedText.includes(tagLower);
  return {
    appropriate,
    reason: appropriate ? 'Tag is found in the video title or description.' : 'Tag is not found in the video title or description.',
  };
});

const suggestVideoTagsPrompt = ai.definePrompt({
  name: 'suggestVideoTagsPrompt',
  input: {schema: SuggestVideoTagsInputSchema},
  output: {schema: SuggestVideoTagsOutputSchema},
  tools: [isTagAppropriate],
  prompt: `You are a video tagging expert.  Given the title and description of a video, you will suggest a list of tags that are relevant to the video.

  Title: {{{title}}}
  Description: {{{description}}}

  Please provide 5 to 10 tags.
  For each tag, use the isTagAppropriate tool to determine if the tag is appropriate for the video.  Do not return any tags that the tool determines are not appropriate.
  Do not include the hash symbol (#) in any tags.
  Tags should be concise and composed of at most three words.
  `,
});


export async function suggestVideoTags(input: SuggestVideoTagsInput): Promise<SuggestVideoTagsOutput> {
  return suggestVideoTagsFlow(input);
}

const suggestVideoTagsFlow = ai.defineFlow(
  {
    name: 'suggestVideoTagsFlow',
    inputSchema: SuggestVideoTagsInputSchema,
    outputSchema: SuggestVideoTagsOutputSchema,
  },
  async input => {
    const {output} = await suggestVideoTagsPrompt(input);
    return output!;
  }
);
