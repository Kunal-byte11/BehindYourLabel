
'use client';

import { useState, useRef, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { processImageAction } from '@/lib/actions';
import type { ProcessedScanData, ScanResult } from '@/lib/types';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UploadCloud, XCircle, CheckCircle, AlertCircle, Image as ImageIcon } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import IngredientList from './IngredientList';
import AlternativesSection from './AlternativesSection';
import { useToast } from "@/hooks/use-toast";

const initialState: { data: ProcessedScanData | null; error: string | null; message?: string } = {
  data: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      disabled={pending} 
      className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground opacity-50 hover:opacity-75 disabled:opacity-30"
    >
      {pending ? <LoadingSpinner className="h-5 w-5 mr-2" /> : <UploadCloud className="mr-2 h-5 w-5" />}
      {pending ? 'Analyzing...' : 'Scan Ingredients'}
    </Button>
  );
}

const ImageUploadForm = () => {
  const [formState, formAction, isPending] = useActionState(processImageAction, initialState);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scanHistory, setScanHistory] = useLocalStorage<ScanResult[]>('scanHistory', []);
  const { toast } = useToast();
  const [showResults, setShowResults] = useState(false);


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setShowResults(false); 
    } else {
      setImagePreview(null);
      setImageFileName(null);
    }
  };

  useEffect(() => {
    if (!isPending && (formState.data || formState.error || formState.message)) {
      setShowResults(true);
    }

    if (!isPending && formState.data) {
      const newScan: ScanResult = {
        id: new Date().toISOString(),
        timestamp: Date.now(),
        imageUrl: imagePreview || undefined, 
        originalImageFileName: imageFileName || 'Uploaded Image',
        extractedIngredients: formState.data.detailedIngredients,
        suggestedAlternatives: formState.data.alternatives,
      };
      setScanHistory([newScan, ...scanHistory.slice(0, 9)]);
      toast({
        title: "Scan Successful",
        description: "Ingredients extracted and alternatives suggested.",
        action: <CheckCircle className="text-green-500" />,
      });
    } else if (!isPending && formState.error) {
       toast({
        title: "Scan Error",
        description: formState.error,
        variant: "destructive",
        action: <XCircle className="text-white" />,
      });
    } else if (!isPending && formState.message && !formState.data && !formState.error) { 
       toast({
        title: "Notification",
        description: formState.message,
        action: <AlertCircle className="text-blue-500" />,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState, isPending]); 

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFileName(null);
    setShowResults(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; 
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl rounded-xl overflow-hidden">
      <CardHeader className="bg-muted/50 p-6">
        <CardTitle className="text-3xl font-bold text-center text-primary">
          <ImageIcon className="inline-block mr-2 h-8 w-8" />
          Inside Label
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground text-base">
          Upload an image of the ingredient list to get AI-powered insights.
        </CardDescription>
      </CardHeader>
      
      <form action={formAction}>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="image-upload" className="block text-sm font-medium text-foreground mb-1">
              Product Label Image
            </label>
            <Input
              id="image-upload"
              name="image"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              required
              className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
            />
            {imageFileName && <p className="text-xs text-muted-foreground mt-1">Selected: {imageFileName}</p>}
          </div>

          {imagePreview && !showResults && ( 
            <div className="mt-4 relative group aspect-[16/10] w-full max-w-md mx-auto rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/50 shadow-inner bg-muted/30 flex items-center justify-center">
              <Image src={imagePreview} alt="Image preview" layout="fill" objectFit="contain" data-ai-hint="product label"/>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-50 group-hover:opacity-100 transition-opacity z-10"
                onClick={handleRemoveImage}
                aria-label="Remove image"
              >
                <XCircle className="h-5 w-5" />
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center p-6 border-t bg-muted/30">
          <SubmitButton />
        </CardFooter>
      </form>

      {showResults && (
        <div className="p-6 border-t">
          {isPending && (
            <div className="text-center py-8">
              <LoadingSpinner className="h-12 w-12 mx-auto" />
              <p className="mt-3 text-muted-foreground">Analyzing your image...</p>
            </div>
          )}

          {formState.error && (
            <Alert variant="destructive" className="my-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Analysis Error</AlertTitle>
              <AlertDescription>{formState.error}</AlertDescription>
            </Alert>
          )}
          
          {formState.data && (
            <div className="mt-2 space-y-8">
              {imagePreview && ( 
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold mb-3 text-primary">Scanned Image</h2>
                  <div className="relative group aspect-[16/10] w-full max-w-md mx-auto rounded-lg overflow-hidden border shadow-md">
                    <Image src={imagePreview} alt="Scanned product label" layout="fill" objectFit="contain" data-ai-hint="label analysis"/>
                     <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute bottom-2 right-2 bg-background/70 hover:bg-background text-xs"
                        onClick={handleRemoveImage}
                        aria-label="Clear image and results"
                      >
                        <XCircle className="mr-1 h-4 w-4" /> Clear
                      </Button>
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-2xl font-semibold mb-4 text-primary">Extracted Ingredients</h2>
                <IngredientList ingredients={formState.data.detailedIngredients} />
              </div>
              
              {formState.data.alternatives.length > 0 && (
                <AlternativesSection alternatives={formState.data.alternatives} />
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default ImageUploadForm;
