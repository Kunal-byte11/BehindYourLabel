import type { Ingredient } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, ShieldCheck, ShieldQuestion, AlertTriangle } from 'lucide-react';

interface IngredientCardProps {
  ingredient: Ingredient;
}

const IngredientCard = ({ ingredient }: IngredientCardProps) => {
  const getRiskBadge = () => {
    switch (ingredient.riskLevel) {
      case 'Low':
        return (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white">
            <ShieldCheck className="mr-1 h-4 w-4" /> Low Risk
          </Badge>
        );
      case 'Medium':
        return (
          <Badge variant="default" className="bg-accent text-accent-foreground">
            <AlertTriangle className="mr-1 h-4 w-4" /> Medium Risk
          </Badge>
        );
      case 'High':
        return (
          <Badge variant="destructive">
            <ShieldAlert className="mr-1 h-4 w-4" /> High Risk
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <ShieldQuestion className="mr-1 h-4 w-4" /> Unknown Risk
          </Badge>
        );
    }
  };

  return (
    <Card className="shadow-lg transition-all duration-300 hover:shadow-xl">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold capitalize">{ingredient.name}</CardTitle>
          {getRiskBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm text-muted-foreground mb-2">
          {ingredient.description}
        </CardDescription>
        <p className="text-sm">
          <strong className="font-medium text-foreground/80">Health Impact:</strong> {ingredient.healthImpact}
        </p>
      </CardContent>
    </Card>
  );
};

export default IngredientCard;
