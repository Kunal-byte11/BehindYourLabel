// This is a server-side file!
'use server';

/**
 * @fileOverview Extracts ingredients from a product label image using OCR and AI.
 *
 * - extractIngredients - A function that handles the ingredient extraction process.
 * - ExtractIngredientsInput - The input type for the extractIngredients function.
 * - ExtractIngredientsOutput - The return type for the extractIngredients function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractIngredientsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a product's ingredient list, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractIngredientsInput = z.infer<typeof ExtractIngredientsInputSchema>;

const ExtractIngredientsOutputSchema = z.object({
  ingredients: z
    .array(z.string())
    .describe('A list of ingredients extracted from the product label.'),
});
export type ExtractIngredientsOutput = z.infer<typeof ExtractIngredientsOutputSchema>;

export async function extractIngredients(input: ExtractIngredientsInput): Promise<ExtractIngredientsOutput> {
  return extractIngredientsFlow(input);
}

const ingredientSynonymsTool = ai.defineTool({
  name: 'ingredientSynonyms',
  description: 'Looks up common synonyms for an ingredient to improve recognition accuracy.',
  inputSchema: z.object({
    ingredient: z.string().describe('The ingredient to find synonyms for.'),
  }),
  outputSchema: z.array(z.string()).describe('A list of synonyms for the ingredient.'),
}, async (input) => {
  // Mock implementation of synonym lookup.  In a real application, this would
  // query a database or external API.
  const synonymMap: { [key: string]: string[] } = {
    'Sodium Laureth Sulfate': ['SLES', 'Sodium Lauryl Ether Sulfate'],
    'Paraben': ['Butylparaben', 'Methylparaben', 'Propylparaben'],
    'Fragrance': ['Parfum', 'Aroma'],
    'EDTA': ['Ethylenediaminetetraacetic Acid'],
  };

  return synonymMap[input.ingredient] || [];
});

const extractIngredientsPrompt = ai.definePrompt({
  name: 'extractIngredientsPrompt',
  tools: [ingredientSynonymsTool],
  input: {schema: ExtractIngredientsInputSchema},
  output: {schema: ExtractIngredientsOutputSchema},
  prompt: `You are an AI assistant that extracts ingredients from a product label image.

  Analyze the image of the product label and extract a list of ingredients. Use the ingredientSynonyms tool to improve ingredient recognition by finding common synonyms.
  
  Image: {{media url=photoDataUri}}
  
  Ingredients:`, // The assistant should extract the ingredients and list them
});

const extractIngredientsFlow = ai.defineFlow(
  {
    name: 'extractIngredientsFlow',
    inputSchema: ExtractIngredientsInputSchema,
    outputSchema: ExtractIngredientsOutputSchema,
  },
  async input => {
    const {output} = await extractIngredientsPrompt(input);
    return output!;
  }
);
