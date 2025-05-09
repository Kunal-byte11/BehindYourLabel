import type { AlternativeProduct } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface AlternativesSectionProps {
  alternatives: AlternativeProduct[];
}

const AlternativesSection = ({ alternatives }: AlternativesSectionProps) => {
  if (alternatives.length === 0) {
    return null; // Don't render anything if no alternatives, or could show a "No alternatives needed/found" message.
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <Lightbulb className="h-6 w-6 mr-2 text-primary" />
        Safer Alternative Suggestions
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {alternatives.map((alt, index) => (
          <Card key={`${alt.name}-${index}`} className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-lg font-medium">{alt.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-muted-foreground mb-2">{alt.description}</CardDescription>
              <p className="text-xs text-foreground/80">
                <strong className="font-medium">Reason:</strong> {alt.reason}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AlternativesSection;
