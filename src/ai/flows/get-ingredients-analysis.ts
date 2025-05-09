// This is a server-side file!
'use server';

/**
 * @fileOverview Analyzes a list of ingredients using an AI model to provide detailed information.
 *
 * - getIngredientsAnalysis - A function that queries an AI for detailed analysis of multiple ingredients.
 * - GetIngredientsAnalysisInput - The input type for the function.
 * - GetIngredientsAnalysisOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IngredientAnalysisSchema = z.object({
  ingredient: z.string().describe('Name of the ingredient.'),
  description: z.string().describe('A concise description of what the ingredient is.'),
  purpose: z.string().describe('What the ingredient is used for in the product.'),
  risk_level: z.enum(['Low', 'Medium', 'High']).describe('Risk level: Low, Medium, or High.'),
  health_impact: z.string().describe('Short explanation of its health effect.'),
  safe_alternative: z.string().optional().describe('A safer alternative ingredient, if one exists and is commonly known, otherwise omit or leave as an empty string.'),
});

const GetIngredientsAnalysisInputSchema = z.object({
  ingredientNames: z.array(z.string()).describe('An array of ingredient names to analyze.'),
});
export type GetIngredientsAnalysisInput = z.infer<typeof GetIngredientsAnalysisInputSchema>;

const GetIngredientsAnalysisOutputSchema = z.array(IngredientAnalysisSchema);
export type GetIngredientsAnalysisOutput = z.infer<typeof GetIngredientsAnalysisOutputSchema>;

export async function getIngredientsAnalysis(input: GetIngredientsAnalysisInput): Promise<GetIngredientsAnalysisOutput> {
  if (!input.ingredientNames || input.ingredientNames.length === 0) {
    return []; // Return empty array if no ingredients are provided
  }
  return getIngredientsAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getIngredientsAnalysisPrompt',
  input: {schema: GetIngredientsAnalysisInputSchema},
  output: {schema: GetIngredientsAnalysisOutputSchema},
  prompt: `You are a health and cosmetic ingredient analyst.

Given the following list of product ingredients, return a JSON array with each item containing:
- "ingredient": (name of the ingredient)
- "description": (a concise description of what the ingredient is)
- "purpose": (what it's used for in the product)
- "risk_level": ("Low" | "Medium" | "High")
- "health_impact": (short explanation of its health effect)
- "safe_alternative": (a safer alternative ingredient, if one exists and is commonly known, otherwise omit or leave as an empty string)

Example for a single ingredient (you will receive a list and should return an array of such objects):
{
  "ingredient": "Parabens",
  "description": "A class of widely used preservatives.",
  "purpose": "Preservative to prevent growth of bacteria and mold.",
  "risk_level": "High",
  "health_impact": "May disrupt hormones and cause allergic reactions.",
  "safe_alternative": "Phenoxyethanol"
}

Now analyze the following ingredients. Ensure your output is a valid JSON array.
{{#if ingredientNames}}
Ingredients to analyze:
{{#each ingredientNames}}
- {{this}}
{{/each}}
{{else}}
No ingredients provided for analysis.
{{/if}}
`,
});

const getIngredientsAnalysisFlow = ai.defineFlow(
  {
    name: 'getIngredientsAnalysisFlow',
    inputSchema: GetIngredientsAnalysisInputSchema,
    outputSchema: GetIngredientsAnalysisOutputSchema,
  },
  async (input: GetIngredientsAnalysisInput) => {
    const {output} = await prompt(input, {
        config: {
            safetySettings: [ // Adjusted safety settings as an example
              { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
              { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
              { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
              { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            ],
        }
    });
    if (!output) {
        // This case might occur if the AI call itself fails or returns nothing.
        // The schema validation might also fail if the AI returns malformed JSON for the array.
        console.error('AI analysis returned no output or malformed output.');
        return []; // Return empty array or handle error appropriately
    }
    return output;
  }
);
