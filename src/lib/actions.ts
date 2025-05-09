
'use server';

import { extractIngredients } from '@/ai/flows/extract-ingredients';
import { suggestSaferAlternatives } from '@/ai/flows/suggest-safer-alternatives';
import { getIngredientsAnalysis } from '@/ai/flows/get-ingredients-analysis';
// getLocalIngredientDetails is no longer the primary source for detailed info.
// import { getIngredientDetails as getLocalIngredientDetails } from '@/lib/ingredient-data';
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

    // Get detailed analysis from AI
    const analysisResults = await getIngredientsAnalysis({ ingredientNames: extractedIngredientNames });

    const detailedIngredients: Ingredient[] = analysisResults.map(item => ({
      name: item.ingredient,
      description: item.description,
      purpose: item.purpose,
      healthImpact: item.health_impact,
      riskLevel: item.risk_level,
      safe_alternative: item.safe_alternative,
    }));

    let alternatives: AlternativeProduct[] = [];
    // Suggest product alternatives if high or medium risk ingredients are present
    const harmfulIngredientsForProductAlternatives = detailedIngredients
      .filter(ing => ing.riskLevel === 'High' || ing.riskLevel === 'Medium')
      .map(ing => ing.name);

    if (harmfulIngredientsForProductAlternatives.length > 0) {
      try {
        const alternativesResult = await suggestSaferAlternatives({ ingredients: harmfulIngredientsForProductAlternatives });
        if (alternativesResult && alternativesResult.alternativeProducts) {
          alternatives = alternativesResult.alternativeProducts;
        }
      } catch (altError) {
         console.warn(`Suggesting product alternatives failed:`, altError);
         // Proceed without product-level alternatives if this step fails
      }
    }
    
    return {
      data: {
        detailedIngredients,
        alternatives, // Product-level alternatives
      },
      error: null,
      message: "Ingredients processed successfully."
    };

  } catch (error) {
    console.error('Error processing image:', error);
    const errorMessage = (typeof error === 'object' && error !== null && 'message' in error) 
                         ? String(error.message) 
                         : 'An unexpected error occurred while processing the image. Please try again.';
    return { data: null, error: errorMessage };
  }
}
