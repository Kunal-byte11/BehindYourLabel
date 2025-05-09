// 'use server';

/**
 * @fileOverview Suggests safer alternative products based on identified harmful ingredients.
 *
 * - suggestSaferAlternatives - A function that suggests safer alternative products.
 * - SuggestAlternativesInput - The input type for the suggestSaferAlternatives function.
 * - SuggestAlternativesOutput - The return type for the suggestSaferAlternatives function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const SuggestAlternativesInputSchema = z.object({
  ingredients: z
    .array(z.string())
    .describe('An array of ingredients extracted from the product label.'),
});
export type SuggestAlternativesInput = z.infer<typeof SuggestAlternativesInputSchema>;

// Define the output schema
const SuggestAlternativesOutputSchema = z.object({
  alternativeProducts: z.array(
    z.object({
      name: z.string().describe('The name of the alternative product.'),
      description: z.string().describe('A brief description of the product.'),
      reason: z
        .string()
        .describe('The reason why this product is a safer alternative.'),
    })
  ),
});
export type SuggestAlternativesOutput = z.infer<typeof SuggestAlternativesOutputSchema>;

export async function suggestSaferAlternatives(input: SuggestAlternativesInput): Promise<SuggestAlternativesOutput> {
  return suggestSaferAlternativesFlow(input);
}

const getAlternativeProducts = ai.defineTool({
  name: 'getAlternativeProducts',
  description: 'Suggests safer alternative products based on a list of harmful ingredients.',
  inputSchema: z.object({
    ingredients: z
      .array(z.string())
      .describe('A list of harmful ingredients to find alternatives for.'),
  }),
  outputSchema: z.array(
    z.object({
      name: z.string().describe('The name of the alternative product.'),
      description: z.string().describe('A brief description of the product.'),
      reason: z
        .string()
        .describe('The reason why this product is a safer alternative.'),
    })
  ),
},
async input => {
    // Mock implementation - replace with actual database lookup or API call
    const alternatives = input.ingredients.map(ingredient => ({
      name: `Alternative to ${ingredient}`,
      description: `This product is a safer alternative to products containing ${ingredient}.`,
      reason: `Does not contain ${ingredient}`,
    }));
    return alternatives;
  }
);

const prompt = ai.definePrompt({
  name: 'suggestSaferAlternativesPrompt',
  input: {schema: SuggestAlternativesInputSchema},
  output: {schema: SuggestAlternativesOutputSchema},
  tools: [getAlternativeProducts],
  prompt: `Based on the identified ingredients, suggest safer alternative products. Use the getAlternativeProducts tool to find the alternatives.

Ingredients: {{ingredients}}

Suggest alternative products:
`,
});

const suggestSaferAlternativesFlow = ai.defineFlow(
  {
    name: 'suggestSaferAlternativesFlow',
    inputSchema: SuggestAlternativesInputSchema,
    outputSchema: SuggestAlternativesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
