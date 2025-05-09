import type { Ingredient } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, ShieldCheck, ShieldQuestion, AlertTriangle, Leaf } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


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
        // Using accent color (Orange) for Medium Risk
        return (
          <Badge variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90">
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
    <Card className="shadow-lg transition-all duration-300 hover:shadow-xl bg-card text-card-foreground rounded-lg">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-xl font-semibold capitalize">{ingredient.name}</CardTitle>
          {getRiskBadge()}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="details" className="border-b-0">
            <AccordionTrigger className="text-sm font-medium text-primary hover:no-underline py-2">
              Show Details
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2 text-sm">
              <div>
                <strong className="font-medium text-foreground/90">Description:</strong>
                <p className="text-muted-foreground leading-relaxed">{ingredient.description}</p>
              </div>
              <div>
                <strong className="font-medium text-foreground/90">Health Impact:</strong>
                <p className="text-muted-foreground leading-relaxed">{ingredient.healthImpact}</p>
              </div>
              {ingredient.alternatives && ingredient.alternatives.length > 0 && (
                <div>
                  <strong className="font-medium text-foreground/90 flex items-center">
                    <Leaf className="h-4 w-4 mr-1 text-green-600" />
                    Ingredient Alternatives:
                  </strong>
                  <ul className="list-disc list-inside pl-4 space-y-1 text-muted-foreground">
                    {ingredient.alternatives.map((alt, index) => (
                      <li key={index}>{alt}</li>
                    ))}
                  </ul>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default IngredientCard;