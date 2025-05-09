import type { AlternativeProduct } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, CheckSquare } from 'lucide-react';

interface AlternativesSectionProps {
  alternatives: AlternativeProduct[];
}

const AlternativesSection = ({ alternatives }: AlternativesSectionProps) => {
  if (alternatives.length === 0) {
    return (
      <div className="mt-8 p-6 bg-muted/50 rounded-lg text-center">
        <CheckSquare className="h-10 w-10 mx-auto mb-3 text-green-500" />
        <h3 className="text-xl font-semibold text-foreground/90">No Harmful Ingredients Prioritized!</h3>
        <p className="text-muted-foreground mt-1">
          It seems the scanned product doesn't contain ingredients that trigger high-priority alternative suggestions, or no specific alternatives were found for the identified items.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4 flex items-center text-primary">
        <Lightbulb className="h-7 w-7 mr-2" />
        Safer Alternative Suggestions
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        {alternatives.map((alt, index) => (
          <Card key={`${alt.name}-${index}`} className="shadow-md hover:shadow-lg transition-shadow duration-300 bg-card rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-primary">{alt.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80 mb-2">{alt.description}</p>
              <CardDescription className="text-xs text-muted-foreground italic">
                <strong className="font-medium not-italic text-accent">Why it's suggested:</strong> {alt.reason}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AlternativesSection;
