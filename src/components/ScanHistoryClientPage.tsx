'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { ScanResult, Ingredient } from '@/lib/types';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { History, Trash2, Eye, ShieldAlert, ShieldCheck, ShieldQuestion, AlertTriangle, ChevronDown } from 'lucide-react';
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
  
  const getRiskBadgeForHistory = (riskLevel: Ingredient['riskLevel']) => {
    switch (riskLevel) {
      case 'Low':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white text-xs"><ShieldCheck className="mr-1 h-3 w-3" />Low</Badge>;
      case 'Medium':
        return <Badge variant="default" className="bg-accent text-accent-foreground text-xs"><AlertTriangle className="mr-1 h-3 w-3" />Medium</Badge>;
      case 'High':
        return <Badge variant="destructive" className="text-xs"><ShieldAlert className="mr-1 h-3 w-3" />High</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs"><ShieldQuestion className="mr-1 h-3 w-3" />Unknown</Badge>;
    }
  };

  if (!mounted) {
    // Prevents hydration mismatch by not rendering until client-side
    return (
        <div className="text-center py-10">
            <History className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h1 className="text-3xl font-bold mb-2">Scan History</h1>
            <p className="text-muted-foreground">Loading scan history...</p>
        </div>
    );
  }

  if (scanHistory.length === 0) {
    return (
      <div className="text-center py-10">
        <History className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="text-3xl font-bold mb-2">Scan History</h1>
        <p className="text-muted-foreground">No scans recorded yet. Start scanning to see your history here.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <History className="mr-3 h-8 w-8 text-primary" />
          Scan History
        </h1>
        {scanHistory.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
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
                <AlertDialogAction onClick={handleDeleteAllScans}>
                  Yes, delete all
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {scanHistory.map((scan) => (
          <Card key={scan.id} className="shadow-lg transition-shadow hover:shadow-xl">
             <AccordionItem value={scan.id} className="border-b-0">
                <AccordionTrigger className="p-4 hover:no-underline">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full text-left">
                        <div className="flex items-center mb-2 sm:mb-0">
                            {scan.imageUrl && (
                                <div className="relative w-16 h-16 mr-4 rounded-md overflow-hidden border">
                                <Image src={scan.imageUrl} alt="Scanned product" layout="fill" objectFit="cover" data-ai-hint="product label"/>
                                </div>
                            )}
                            <div>
                                <h3 className="text-lg font-semibold">{scan.originalImageFileName || 'Scanned Image'}</h3>
                                <p className="text-xs text-muted-foreground">
                                {new Date(scan.timestamp).toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                            <Badge variant="outline">{scan.extractedIngredients.length} Ingredients</Badge>
                            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 accordion-chevron" />
                        </div>
                    </div>
                </AccordionTrigger>
              <AccordionContent className="p-4 pt-0">
                <div>
                  <h4 className="text-md font-semibold mt-2 mb-2">Extracted Ingredients:</h4>
                  {scan.extractedIngredients.length > 0 ? (
                    <ul className="space-y-1 list-disc list-inside pl-2 max-h-60 overflow-y-auto">
                      {scan.extractedIngredients.map((ing, idx) => (
                        <li key={idx} className="text-sm flex justify-between items-center">
                          <span className="capitalize">{ing.name}</span>
                          {getRiskBadgeForHistory(ing.riskLevel)}
                        </li>
                      ))}
                    </ul>
                  ) : <p className="text-sm text-muted-foreground">No ingredients found.</p>}
                </div>
                {scan.suggestedAlternatives.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-md font-semibold mb-2">Suggested Alternatives:</h4>
                    <ul className="space-y-1 list-disc list-inside pl-2 max-h-40 overflow-y-auto">
                      {scan.suggestedAlternatives.map((alt, idx) => (
                        <li key={idx} className="text-sm">{alt.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mt-4 text-right">
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
                            <AlertDialogAction onClick={() => handleDeleteScan(scan.id)}>
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
      <style jsx>{`
        .accordion-chevron { /* Default state, arrow pointing down */
          transform: rotate(0deg);
        }
        [data-state=open] .accordion-chevron { /* Open state, arrow pointing up */
          transform: rotate(180deg);
        }
      `}</style>
    </div>
  );
};

export default ScanHistoryClientPage;
