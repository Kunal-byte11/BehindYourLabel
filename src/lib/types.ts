
export interface Ingredient {
  name: string;
  description: string;
  healthImpact: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Unknown';
  alternatives?: string[]; // Ingredient-specific alternatives
}

export interface AlternativeProduct {
  name: string;
  description: string;
  reason: string;
}

export interface ScanResult {
  id: string;
  timestamp: number;
  imageUrl?: string; 
  originalImageFileName?: string; 
  extractedIngredients: Ingredient[];
  suggestedAlternatives: AlternativeProduct[]; // Product-level alternatives
}

export interface ProcessedScanData {
  detailedIngredients: Ingredient[];
  alternatives: AlternativeProduct[]; // Product-level alternatives
}
