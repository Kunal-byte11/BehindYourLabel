'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { ScanResult, Ingredient } from '@/lib/types';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { History, Trash2, Eye, ShieldAlert, ShieldCheck, ShieldQuestion, AlertTriangle, Info, Leaf } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import LoadingSpinner from './LoadingSpinner'; 

const ScanHistoryClientPage = () => {
  const [scanHistory, setScanHistory] = useLocalStorage<ScanResult[]>('scanHistory', []);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDeleteScan = (id: string) => {
    setScanHistory(scanHistory.filter(scan => scan.id !== id));
  };

  const handleDeleteAllScans = () => {
    setScanHistory([]);
  };
  
  const getRiskBadgeForHistory = (riskLevel: Ingredient['riskLevel'] | undefined) => {
    // Ensure riskLevel is one of the defined types, default to secondary if somehow undefined
    const validRiskLevel = riskLevel && ['Low', 'Medium', 'High'].includes(riskLevel) ? riskLevel : undefined;
    switch (validRiskLevel) {
      case 'Low':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white text-xs shrink-0"><ShieldCheck className="mr-1 h-3 w-3" />Low</Badge>;
      case 'Medium':
        return <Badge variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90 text-xs shrink-0"><AlertTriangle className="mr-1 h-3 w-3" />Medium</Badge>;
      case 'High':
        return <Badge variant="destructive" className="text-xs shrink-0"><ShieldAlert className="mr-1 h-3 w-3" />High</Badge>;
      default: // Covers undefined or 'Unknown' if it were possible
        return <Badge variant="secondary" className="text-xs shrink-0"><ShieldQuestion className="mr-1 h-3 w-3" />N/A</Badge>;
    }
  };

  if (!mounted) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center py-10">
            <LoadingSpinner className="h-12 w-12 text-primary mb-4" />
            <h1 className="text-3xl font-bold mb-2 text-foreground">Loading Scan History</h1>
            <p className="text-muted-foreground">Please wait a moment...</p>
        </div>
    );
  }

  if (scanHistory.length === 0) {
    return (
      <div className="text-center py-10 min-h-[calc(100vh-12rem)] flex flex-col items-center justify-center">
        <History className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold mb-3 text-foreground">Scan History is Empty</h1>
        <p className="text-muted-foreground max-w-md">
          No scans recorded yet. Start scanning product labels to build your history and easily review past analyses.
        </p>
         <Button asChild className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
          <a href="/">Start Scanning</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold flex items-center text-primary text-center sm:text-left mx-auto sm:mx-0">
          <History className="mr-3 h-10 w-10" />
          Scan History
        </h1>
        {scanHistory.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="w-full sm:w-auto">
                <Trash2 className="mr-2 h-4 w-4" /> Clear All History
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all your scan history.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAllScans} className="bg-destructive hover:bg-destructive/90">
                  Yes, delete all
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {scanHistory.map((scan) => (
          <Card key={scan.id} className="shadow-lg transition-shadow hover:shadow-xl bg-card rounded-lg overflow-hidden">
             <AccordionItem value={scan.id} className="border-b-0">
                <AccordionTrigger className="p-4 hover:no-underline hover:bg-muted/30 [&[data-state=open]>svg]:rotate-180">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full text-left gap-3">
                        <div className="flex items-center mb-2 sm:mb-0 w-full sm:w-auto min-w-0">
                            {scan.imageUrl && (
                                <div className="relative w-16 h-16 mr-4 rounded-md overflow-hidden border-2 border-border flex-shrink-0 bg-muted">
                                <Image src={scan.imageUrl} alt="Scanned product" layout="fill" objectFit="contain" data-ai-hint="product label"/>
                                </div>
                            )}
                            <div className="flex-grow min-w-0">
                                <h3 className="text-lg font-semibold truncate text-foreground" title={scan.originalImageFileName || 'Scanned Image'}>{scan.originalImageFileName || 'Scanned Image'}</h3>
                                <p className="text-xs text-muted-foreground">
                                {new Date(scan.timestamp).toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-2 sm:mt-0 flex-shrink-0 self-end sm:self-center">
                            <Badge variant="outline" className="text-xs sm:text-sm whitespace-nowrap">{scan.extractedIngredients.length} Ingredients</Badge>
                        </div>
                    </div>
                </AccordionTrigger>
              <AccordionContent className="p-4 pt-0 bg-muted/20">
                <div className="mb-4">
                  <h4 className="text-md font-semibold mt-2 mb-2 text-primary">Extracted Ingredients:</h4>
                  {scan.extractedIngredients.length > 0 ? (
                    <ul className="space-y-1.5 max-h-60 overflow-y-auto text-sm pr-2">
                      {scan.extractedIngredients.map((ing, idx) => (
                        <li key={idx} className="flex justify-between items-center p-1.5 bg-background/50 rounded-md">
                          <span className="capitalize truncate pr-2 text-foreground/90" title={ing.name}>{ing.name}</span>
                          {getRiskBadgeForHistory(ing.riskLevel)}
                        </li>
                      ))}
                    </ul>
                  ) : <p className="text-sm text-muted-foreground italic">No ingredients were extracted for this scan.</p>}
                </div>

                {scan.suggestedAlternatives && scan.suggestedAlternatives.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-md font-semibold mb-2 text-primary">Suggested Alternative Products:</h4>
                    <ul className="space-y-1 list-disc list-inside pl-2 max-h-40 overflow-y-auto text-sm">
                      {scan.suggestedAlternatives.map((alt, idx) => (
                        <li key={idx} className="truncate text-foreground/80" title={alt.name}>{alt.name}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {scan.extractedIngredients.some(ing => ing.safe_alternative) && (
                   <div className="mb-4">
                    <h4 className="text-md font-semibold mb-2 text-primary flex items-center"><Leaf className="h-4 w-4 mr-1 text-green-600" />Ingredient-Specific Alternatives:</h4>
                     <Accordion type="multiple" collapsible className="w-full text-sm">
                      {scan.extractedIngredients.filter(ing => ing.safe_alternative).map((ing, idx) => (
                        <AccordionItem key={`alt-${idx}`} value={`alt-${ing.name}`} className="border-b border-border/50 last:border-b-0">
                          <AccordionTrigger className="py-2 text-left text-foreground/80 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                            Alternative for <span className="font-medium capitalize pl-1">{ing.name}</span>
                          </AccordionTrigger>
                          <AccordionContent className="pb-2 pt-1 pl-4">
                            <p className="text-muted-foreground">{ing.safe_alternative}</p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                     </Accordion>
                   </div>
                )}


                <div className="mt-6 text-right">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/50">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Scan
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete this scan?</AlertDialogTitle>
                            <AlertDialogDescription>
                            This action will permanently delete this scan from your history.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteScan(scan.id)} className="bg-destructive hover:bg-destructive/90">
                            Yes, delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Card>
        ))}
      </Accordion>
    </div>
  );
};

export default ScanHistoryClientPage;
