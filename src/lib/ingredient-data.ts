import type { Ingredient } from '@/lib/types';

// Omit 'name' as it will be the key, and add 'alternatives'
export const ingredientDetails: Record<string, Omit<Ingredient, 'name'>> = {
  'paraben': {
    description: 'A class of widely used preservatives in cosmetic and pharmaceutical products. They prevent the growth of bacteria and mold.',
    healthImpact: 'Potential endocrine disruptor, meaning it can interfere with hormone systems. Some studies link parabens to reproductive issues and increased risk of certain cancers. Can cause skin irritation and allergic reactions in some individuals.',
    riskLevel: 'Medium',
    alternatives: ['Phenoxyethanol', 'Sodium Benzoate', 'Potassium Sorbate', 'Natural extracts with preservative properties (e.g., grapefruit seed extract, rosemary extract)'],
  },
  'methylparaben': {
    description: 'A type of paraben, commonly used as an anti-fungal agent and preservative in cosmetics and personal care products.',
    healthImpact: 'Considered one of the less potent parabens, but still shares general paraben concerns like potential endocrine disruption and skin irritation. Regulatory bodies often deem it safe at low concentrations.',
    riskLevel: 'Medium',
    alternatives: ['Phenoxyethanol', 'Caprylyl Glycol', 'Ethylhexylglycerin'],
  },
  'butylparaben': {
    description: 'A type of paraben used as a preservative. It is more potent than methylparaben.',
    healthImpact: 'Stronger potential endocrine disruptor compared to methylparaben. Associated with reproductive toxicity and developmental issues in animal studies. Higher concern for bioaccumulation.',
    riskLevel: 'High',
    alternatives: ['Look for "paraben-free" labels', 'Products preserved with sorbic acid or benzoic acid'],
  },
  'propylparaben': {
    description: 'A type of paraben used as a preservative, similar in potency and concern to butylparaben.',
    healthImpact: 'Potential endocrine disruptor with effects on reproductive systems shown in animal studies. Can cause skin sensitization.',
    riskLevel: 'High',
    alternatives: ['Opt for products with natural preservatives', 'Benzyl Alcohol'],
  },
  'edta': { // Also Ethylenediaminetetraacetic Acid
    description: 'Ethylenediaminetetraacetic acid (EDTA) is a chelating agent. It binds to metal ions, improving product stability, texture, and rinse-off performance.',
    healthImpact: 'Generally considered safe for use in cosmetics in permitted concentrations. However, it can enhance the penetration of other ingredients through the skin, which could be a concern if harmful chemicals are also present. Not readily biodegradable, leading to environmental concerns.',
    riskLevel: 'Low',
    alternatives: ['Sodium Phytate', 'Gluconolactone', 'Citric Acid (in some applications)'],
  },
  'ethylenediaminetetraacetic acid': { // Alias for EDTA
    description: 'Ethylenediaminetetraacetic acid (EDTA) is a chelating agent. It binds to metal ions, improving product stability, texture, and rinse-off performance.',
    healthImpact: 'Generally considered safe for use in cosmetics in permitted concentrations. However, it can enhance the penetration of other ingredients through the skin, which could be a concern if harmful chemicals are also present. Not readily biodegradable, leading to environmental concerns.',
    riskLevel: 'Low',
    alternatives: ['Sodium Phytate', 'Gluconolactone', 'Citric Acid (in some applications)'],
  },
  'sodium laureth sulfate': { // SLES
    description: 'A surfactant (surface active agent) and foaming agent commonly found in cleansers, shampoos, and soaps. It creates lather.',
    healthImpact: 'Can cause skin and eye irritation, especially in higher concentrations or with prolonged exposure. A primary concern is potential contamination with 1,4-dioxane, a suspected carcinogen, during its manufacturing process (ethoxylation).',
    riskLevel: 'Medium',
    alternatives: ['Sodium Cocoyl Isethionate', 'Decyl Glucoside', 'Lauryl Glucoside', 'Cocamidopropyl Betaine (can still be irritating for some)'],
  },
  'sles': { // Alias for Sodium Laureth Sulfate
    description: 'Sodium Laureth Sulfate, an anionic surfactant used for its cleansing and foaming properties in many personal care products.',
    healthImpact: 'Can cause skin irritation. Risk of contamination with 1,4-dioxane, a potential carcinogen, during manufacturing.',
    riskLevel: 'Medium',
    alternatives: ['Sodium Lauroyl Sarcosinate', 'Disodium Laureth Sulfosuccinate'],
  },
  'sodium lauryl ether sulfate': { // Alias for SLES
    description: 'Another name for Sodium Laureth Sulfate (SLES), a common surfactant in cleansing products.',
    healthImpact: 'Can cause skin irritation. Risk of contamination with 1,4-dioxane, a potential carcinogen, during manufacturing.',
    riskLevel: 'Medium',
    alternatives: ['Sulfate-free cleansers', 'Glucoside-based surfactants'],
  },
  'fragrance': { // Also Parfum, Aroma
    description: 'A complex mixture of scent chemicals, often undeclared individually to protect trade secrets. Can contain dozens to hundreds of different chemicals.',
    healthImpact: 'One of the most common causes of allergic contact dermatitis. Can trigger asthma, headaches, and other sensitivities. Some fragrance components have been linked to hormone disruption and are classified as potential carcinogens or reproductive toxicants.',
    riskLevel: 'High',
    alternatives: ['Fragrance-free products', 'Products scented with essential oils (note: essential oils can also be allergenic for some)'],
  },
  'parfum': { // Alias for Fragrance
    description: 'International Nomenclature for Cosmetic Ingredients (INCI) term for fragrance. A blend of various scent chemicals.',
    healthImpact: 'Can cause allergies, skin sensitization, respiratory issues. Some fragrance components may be endocrine disruptors or carcinogens.',
    riskLevel: 'High',
    alternatives: ['Unscented products', 'Essential oil blends (use with caution if sensitive)'],
  },
  'aroma': { // Alias for Fragrance
    description: 'Often used interchangeably with fragrance or parfum, indicating a blend of scent compounds.',
    healthImpact: 'Can cause allergies, skin sensitization, respiratory issues. Some fragrance components may be endocrine disruptors or carcinogens.',
    riskLevel: 'High',
    alternatives: ['Products labeled "hypoallergenic" and "fragrance-free"'],
  },
  'citric acid': {
    description: 'An organic acid naturally found in citrus fruits. Used as a preservative, pH adjuster, and chelating agent in cosmetics and food.',
    healthImpact: 'Generally Recognized As Safe (GRAS). Can cause mild skin irritation or stinging in high concentrations or on sensitive/broken skin. Not a significant health concern for most people.',
    riskLevel: 'Low',
    alternatives: ['Lactic Acid (for pH adjustment)', 'Sodium Citrate (as a chelator/buffer)'],
  },
  'talc': {
    description: 'A mineral composed of hydrated magnesium silicate. Used in cosmetics for its absorbent properties and to improve texture.',
    healthImpact: 'Concern primarily revolves around potential contamination with asbestos, a known carcinogen. Asbestos-free talc is considered safer, but inhalation of talc particles (even asbestos-free) can cause respiratory issues. Ovarian cancer concerns are controversial and mainly linked to perineal use of talc-based powders.',
    riskLevel: 'Medium', // Can be High if asbestos contamination is a risk
    alternatives: ['Cornstarch', 'Arrowroot powder', 'Rice powder', 'Kaolin clay'],
  },
  'titanium dioxide': {
    description: 'A naturally occurring mineral used as a white pigment, opacifier, and sunscreen agent (physical blocker).',
    healthImpact: 'Generally considered safe for topical use, especially in non-nano form. Concerns arise with inhalation of fine particles/powder (potential carcinogen). Nano-sized titanium dioxide in sunscreens has been studied extensively, with most research suggesting minimal skin penetration.',
    riskLevel: 'Low', // For non-nano, topical use. Medium if in powder/aerosol form due to inhalation risk.
    alternatives: ['Zinc Oxide (for sunscreen)', 'Mica (for pigment, different properties)'],
  },
  'glycerin': {
    description: 'A humectant that draws moisture from the air into the skin. Widely used in skincare for its moisturizing properties.',
    healthImpact: 'Very safe and beneficial for most skin types. Non-toxic and non-allergenic for the vast majority of people. Helps maintain skin hydration and barrier function.',
    riskLevel: 'Low',
    alternatives: ['Hyaluronic Acid', 'Sorbitol', 'Propylene Glycol (can be irritating for some)'],
  },
  'aqua': { // Also Water
    description: 'The INCI name for purified water, the most common ingredient in cosmetics, serving as a solvent and base for many formulations.',
    healthImpact: 'Completely safe and essential in many product formulations.',
    riskLevel: 'Low',
  },
  'water': { // Alias for Aqua
    description: 'Purified water, used as a solvent and base in countless cosmetic and food products.',
    healthImpact: 'Essential and safe.',
    riskLevel: 'Low',
  },
  'phenoxyethanol': {
    description: 'A common preservative used as an alternative to parabens. It has broad-spectrum antimicrobial activity.',
    healthImpact: 'Generally considered safe in concentrations up to 1%. Can cause skin irritation and eczema in some individuals, especially those with sensitive skin. Concerns about neurotoxicity in infants if ingested (e.g., via nipple creams not wiped off).',
    riskLevel: 'Low', // Borderline Medium for sensitive individuals or infant products
    alternatives: ['Caprylyl Glycol', 'Ethylhexylglycerin', 'Sodium Benzoate combined with Potassium Sorbate'],
  },
  'alcohol denat.': {
    description: 'Denatured alcohol, ethanol that has additives to make it taste bad, preventing consumption. Used as a solvent, astringent, and to enhance penetration of other ingredients.',
    healthImpact: 'Can be very drying and irritating to the skin, especially in high concentrations. May disrupt the skin barrier, leading to increased sensitivity and damage over time.',
    riskLevel: 'Medium',
    alternatives: ['Fatty alcohols (Cetyl, Stearyl, Cetearyl alcohol - moisturizing)', 'Witch Hazel (alcohol-free versions)', 'Glycerin-based toners'],
  },
   'mineral oil': {
    description: 'A clear, odorless oil derived from petroleum. Used as an emollient and moisturizer due to its occlusive properties.',
    healthImpact: 'Highly refined cosmetic-grade mineral oil is considered safe and non-comedogenic for most. Concerns often stem from poorly refined industrial grades or misconceptions. It can feel heavy on some skin types and may trap other comedogenic ingredients if skin is not cleansed properly.',
    riskLevel: 'Low',
    alternatives: ['Squalane', 'Jojoba Oil', 'Caprylic/Capric Triglyceride', 'Shea Butter'],
  },
  'phthalates': {
    description: 'A group of chemicals used to make plastics more flexible (plasticizers) and as solvents in cosmetics, often found in fragrances and nail polishes.',
    healthImpact: 'Significant concern as endocrine disruptors, linked to reproductive and developmental harm, asthma, and some cancers. Often hidden under "fragrance" or "parfum".',
    riskLevel: 'High',
    alternatives: ['Look for "phthalate-free" labels', 'Avoid products listing generic "fragrance" if concerned'],
  },
  'formaldehyde': {
    description: 'A known carcinogen used as a preservative or released by other preservatives (formaldehyde releasers) in cosmetics.',
    healthImpact: 'Carcinogenic, potent skin sensitizer and allergen. Can cause contact dermatitis and respiratory issues. Strictly regulated, but formaldehyde-releasing preservatives are still common.',
    riskLevel: 'High',
    alternatives: ['Look for "formaldehyde-free" and "formaldehyde-releaser-free" labels', 'Products preserved with phenoxyethanol or parabens (though parabens have their own concerns).'],
  },
};

export const getIngredientDetails = (name: string): Ingredient => {
  const normalizedName = name.toLowerCase().trim();
  const details = ingredientDetails[normalizedName];
  if (details) {
    // Ensure all fields of Ingredient are present, even if alternatives is undefined
    return { 
      name, 
      description: details.description,
      healthImpact: details.healthImpact,
      riskLevel: details.riskLevel,
      alternatives: details.alternatives // This can be undefined, which is fine for the type
    };
  }
  return {
    name,
    description: 'No detailed information available in local database for this ingredient.',
    healthImpact: 'Unknown from local database.',
    riskLevel: 'Unknown',
    // alternatives can be omitted here as it's optional
  };
};
