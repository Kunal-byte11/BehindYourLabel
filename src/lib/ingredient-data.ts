import type { Ingredient } from '@/lib/types';

export const ingredientDetails: Record<string, Omit<Ingredient, 'name'>> = {
  'paraben': {
    description: 'A class of widely used preservatives in cosmetic and pharmaceutical products.',
    healthImpact: 'Potential endocrine disruptor, skin irritation in some individuals.',
    riskLevel: 'Medium',
  },
  'methylparaben': {
    description: 'A type of paraben, a common preservative.',
    healthImpact: 'Potential endocrine disruptor, skin irritation. Generally considered less risky than other parabens by some regulatory bodies if used within limits.',
    riskLevel: 'Medium',
  },
  'butylparaben': {
    description: 'A type of paraben, a common preservative.',
    healthImpact: 'Stronger potential endocrine disruptor compared to methylparaben, skin irritation.',
    riskLevel: 'High',
  },
  'propylparaben': {
    description: 'A type of paraben, a common preservative.',
    healthImpact: 'Potential endocrine disruptor, skin irritation. Concerns similar to butylparaben.',
    riskLevel: 'High',
  },
  'edta': {
    description: 'Ethylenediaminetetraacetic acid, a chelating agent used to improve stability and foaming.',
    healthImpact: 'Generally considered safe in cosmetics but can enhance penetration of other ingredients. Not readily biodegradable.',
    riskLevel: 'Low',
  },
  'ethylenediaminetetraacetic acid': {
    description: 'Ethylenediaminetetraacetic acid (EDTA), a chelating agent used to improve stability and foaming.',
    healthImpact: 'Generally considered safe in cosmetics but can enhance penetration of other ingredients. Not readily biodegradable.',
    riskLevel: 'Low',
  },
  'sodium laureth sulfate': {
    description: 'A surfactant and foaming agent commonly found in cleansers, shampoos, and soaps. (SLES)',
    healthImpact: 'Can cause skin irritation in some individuals, potential for contamination with 1,4-dioxane (a carcinogen) if not properly manufactured.',
    riskLevel: 'Medium',
  },
  'sles': {
    description: 'Sodium Laureth Sulfate, a surfactant and foaming agent.',
    healthImpact: 'Can cause skin irritation, potential for 1,4-dioxane contamination.',
    riskLevel: 'Medium',
  },
  'sodium lauryl ether sulfate': {
    description: 'Another name for Sodium Laureth Sulfate (SLES).',
    healthImpact: 'Can cause skin irritation, potential for 1,4-dioxane contamination.',
    riskLevel: 'Medium',
  },
  'fragrance': {
    description: 'A complex mixture of scent chemicals, often undeclared individually.',
    healthImpact: 'Can cause allergies, skin sensitization, respiratory issues. Some fragrance components may be endocrine disruptors or carcinogens.',
    riskLevel: 'High',
  },
  'parfum': {
    description: 'International nomenclature for fragrance. A complex mixture of scent chemicals.',
    healthImpact: 'Can cause allergies, skin sensitization, respiratory issues. Some fragrance components may be endocrine disruptors or carcinogens.',
    riskLevel: 'High',
  },
  'aroma': {
    description: 'Often used interchangeably with fragrance or parfum.',
    healthImpact: 'Can cause allergies, skin sensitization, respiratory issues. Some fragrance components may be endocrine disruptors or carcinogens.',
    riskLevel: 'High',
  },
  'citric acid': {
    description: 'An organic acid used as a preservative, pH adjuster, and flavoring agent.',
    healthImpact: 'Generally recognized as safe (GRAS). Can cause mild skin irritation in high concentrations for sensitive individuals.',
    riskLevel: 'Low',
  },
  // Add more mock ingredients if needed
};

export const getIngredientDetails = (name: string): Ingredient => {
  const normalizedName = name.toLowerCase().trim();
  const details = ingredientDetails[normalizedName];
  if (details) {
    return { name, ...details };
  }
  return {
    name,
    description: 'No detailed information available for this ingredient.',
    healthImpact: 'Unknown.',
    riskLevel: 'Unknown',
  };
};
