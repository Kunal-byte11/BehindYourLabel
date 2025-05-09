import type { Ingredient } from '@/lib/types';
import IngredientCard from './IngredientCard';

interface IngredientListProps {
  ingredients: Ingredient[];
}

const IngredientList = ({ ingredients }: IngredientListProps) => {
  if (ingredients.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No ingredients found or extracted.</p>;
  }

  return (
    <div className="space-y-4">
      {ingredients.map((ingredient, index) => (
        <IngredientCard key={`${ingredient.name}-${index}`} ingredient={ingredient} />
      ))}
    </div>
  );
};

export default IngredientList;
