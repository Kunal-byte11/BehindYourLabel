'use server';

import { extractIngredients } from '@/ai/flows/extract-ingredients';
import { suggestSaferAlternatives } from '@/ai/flows/suggest-safer-alternatives';
import { getIngredientDetails } from '@/lib/ingredient-data';
import type { ProcessedScanData, Ingredient, AlternativeProduct } from '@/lib/types';

async function fileToDataUri(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64String = buffer.toString('base64');
  return `data:${file.type};base64,${base64String}`;
}

export async function processImageAction(
  prevState: any,
  formData: FormData
): Promise<{ data: ProcessedScanData | null; error: string | null; message?: string }> {
  const imageFile = formData.get('image') as File;

  if (!imageFile || imageFile.size === 0) {
    return { data: null, error: 'No image file provided or file is empty.' };
  }

  if (!imageFile.type.startsWith('image/')) {
     return { data: null, error: 'Invalid file type. Please upload an image.' };
  }

  try {
    const photoDataUri = await fileToDataUri(imageFile);

    const extractionResult = await extractIngredients({ photoDataUri });
    if (!extractionResult || !extractionResult.ingredients) {
      return { data: null, error: 'Failed to extract ingredients from the image.' };
    }
    
    const extractedIngredientNames = extractionResult.ingredients;

    const detailedIngredients: Ingredient[] = extractedIngredientNames.map(name =>
      getIngredientDetails(name)
    );

    let alternatives: AlternativeProduct[] = [];
    if (detailedIngredients.some(ing => ing.riskLevel === 'High' || ing.riskLevel === 'Medium')) {
      const alternativesResult = await suggestSaferAlternatives({ ingredients: extractedIngredientNames });
      if (alternativesResult && alternativesResult.alternativeProducts) {
        alternatives = alternativesResult.alternativeProducts;
      }
    }
    
    return {
      data: {
        detailedIngredients,
        alternatives,
      },
      error: null,
      message: "Ingredients processed successfully."
    };

  } catch (error) {
    console.error('Error processing image:', error);
    return { data: null, error: 'An unexpected error occurred while processing the image. Please try again.' };
  }
}
