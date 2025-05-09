import { config } from 'dotenv';
config();

import '@/ai/flows/extract-ingredients.ts';
import '@/ai/flows/suggest-safer-alternatives.ts';
import '@/ai/flows/get-ingredient-info.ts'; // Added new flow
