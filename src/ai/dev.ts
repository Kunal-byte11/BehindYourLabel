import { config } from 'dotenv';
config();

import '@/ai/flows/extract-ingredients.ts';
import '@/ai/flows/suggest-safer-alternatives.ts';
import '@/ai/flows/get-ingredients-analysis.ts'; // Updated flow
