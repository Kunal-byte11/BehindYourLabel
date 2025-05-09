// This is a server-side file!
'use server';

/**
 * @fileOverview Fetches information about an unknown ingredient using an AI model.
 *
 * - getUnknownIngredientInfo - A function that queries an AI for ingredient details.
 * - GetIngredientInfoInput - The input type for the function.
 * - GetIngredientInfoOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetIngredientInfoInputSchema = z.object({
  ingredientName: z.string().describe('The name of the ingredient to get information for.'),
});
export type GetIngredientInfoInput = z.infer<typeof GetIngredientInfoInputSchema>;

const GetIngredientInfoOutputSchema = z.object({
  description: z.string().describe('A concise description of the ingredient.'),
  healthImpact: z.string().describe('Potential health impacts of the ingredient in cosmetic or food products.'),
  // Risk level is intentionally omitted here as it's hard for AI to give a definitive Low/Medium/High
  // without a structured database and more context. It will remain 'Unknown' from this flow.
});
export type GetIngredientInfoOutput = z.infer<typeof GetIngredientInfoOutputSchema>;

export async function getUnknownIngredientInfo(input: GetIngredientInfoInput): Promise<GetIngredientInfoOutput> {
  return getIngredientInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getIngredientInfoPrompt',
  input: {schema: GetIngredientInfoInputSchema},
  output: {schema: GetIngredientInfoOutputSchema},
  prompt: `You are a helpful assistant providing information about ingredients found in cosmetic or food products.
For the ingredient "{{ingredientName}}":
1. Provide a concise description of what it is and its common uses in these products.
2. Explain its potential health effects or impacts when used in cosmetic or food products. Be factual and neutral. If there are known controversies or significant safety concerns, mention them briefly.

Structure your response to fit the output schema.
Description: (Your description here)
Health Impact: (Your health impact explanation here)
`,
});

const getIngredientInfoFlow = ai.defineFlow(
  {
    name: 'getIngredientInfoFlow',
    inputSchema: GetIngredientInfoInputSchema,
    outputSchema: GetIngredientInfoOutputSchema,
  },
  async input => {
    // Configure safety settings to be less restrictive for general information gathering,
    // but still block harmful content.
    const {output} = await prompt(input, {
        config: {
            safetySettings: [
              { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
              { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
              { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
              { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            ],
        }
    });
    if (!output) {
        return {
            description: "Could not retrieve information for this ingredient.",
            healthImpact: "Unable to determine health impact via AI lookup."
        }
    }
    return output;
  }
);
