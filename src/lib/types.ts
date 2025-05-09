
export interface Ingredient {
  name: string; // From AI: "ingredient"
  description: string; // From AI: "description"
  purpose: string; // From AI: "purpose"
  healthImpact: string; // From AI: "health_impact"
  riskLevel: 'Low' | 'Medium' | 'High'; // From AI: "risk_level" - 'Unknown' if AI fails to classify an item? Prompt expects L/M/H.
  safe_alternative?: string; // From AI: "safe_alternative"
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
