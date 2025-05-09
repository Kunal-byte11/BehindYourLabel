
export interface Ingredient {
  name: string;
  description: string;
  healthImpact: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Unknown';
}

export interface AlternativeProduct {
  name: string;
  description: string;
  reason: string;
}

export interface ScanResult {
  id: string;
  timestamp: number;
  imageUrl?: string; // Optional: if we store image previews
  extractedIngredients: Ingredient[];
  suggestedAlternatives: AlternativeProduct[];
  originalImageFileName?: string; // To display in history
}

export interface ProcessedScanData {
  detailedIngredients: Ingredient[];
  alternatives: AlternativeProduct[];
}
