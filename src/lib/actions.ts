
'use server';

import { extractIngredients } from '@/ai/flows/extract-ingredients';
import { suggestSaferAlternatives } from '@/ai/flows/suggest-safer-alternatives';
import { getUnknownIngredientInfo } from '@/ai/flows/get-ingredient-info';
import { getIngredientDetails as getLocalIngredientDetails } from '@/lib/ingredient-data';
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
    if (!extractionResult || !extractionResult.ingredients || extractionResult.ingredients.length === 0) {
      return { data: null, error: 'Could not extract any ingredients from the image. The image might be unclear or not contain an ingredient list.' };
    }
    
    const extractedIngredientNames = extractionResult.ingredients;

    const detailedIngredientsPromises: Promise<Ingredient>[] = extractedIngredientNames.map(async (name) => {
      let details = getLocalIngredientDetails(name);
      if (details.riskLevel === 'Unknown' && details.description.includes('No detailed information available')) {
        // Ingredient not found or lacks details in local DB, try AI fallback
        try {
          const aiFallbackData = await getUnknownIngredientInfo({ ingredientName: name });
          if (aiFallbackData) {
            details.description = aiFallbackData.description;
            details.healthImpact = aiFallbackData.healthImpact;
            // Risk level remains 'Unknown' as AI fallback doesn't determine this
          }
        } catch (aiError) {
          console.warn(`AI fallback failed for ingredient ${name}:`, aiError);
          // Keep the 'Unknown' details from local DB
        }
      }
      return details;
    });

    const detailedIngredients = await Promise.all(detailedIngredientsPromises);

    let alternatives: AlternativeProduct[] = [];
    // Suggest alternatives if high or medium risk ingredients are present
    const harmfulIngredients = detailedIngredients
      .filter(ing => ing.riskLevel === 'High' || ing.riskLevel === 'Medium')
      .map(ing => ing.name);

    if (harmfulIngredients.length > 0) {
      try {
        const alternativesResult = await suggestSaferAlternatives({ ingredients: harmfulIngredients });
        if (alternativesResult && alternativesResult.alternativeProducts) {
          alternatives = alternativesResult.alternativeProducts;
        }
      } catch (altError) {
         console.warn(`Suggesting alternatives failed:`, altError);
         // Proceed without product-level alternatives if this step fails
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
    // Check if error is an object and has a message property
    const errorMessage = (typeof error === 'object' && error !== null && 'message' in error) 
                         ? String(error.message) 
                         : 'An unexpected error occurred while processing the image. Please try again.';
    return { data: null, error: errorMessage };
  }
}
