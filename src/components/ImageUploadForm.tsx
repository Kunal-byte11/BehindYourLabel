
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
import { UploadCloud, XCircle, CheckCircle, AlertCircle } from 'lucide-react';
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
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? <LoadingSpinner className="h-5 w-5 mr-2" /> : <UploadCloud className="mr-2 h-5 w-5" />}
      {pending ? 'Analyzing...' : 'Scan Ingredients'}
    </Button>
  );
}

const ImageUploadForm = () => {
  const [formState, formAction] = useActionState(processImageAction, initialState);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scanHistory, setScanHistory] = useLocalStorage<ScanResult[]>('scanHistory', []);
  const { toast } = useToast();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      // Clear previous results when new image is selected
      if (formState.data || formState.error) {
         // This won't directly reset formState from useActionState, but can clear displayed results
         // A more robust way would be to wrap useActionState or manage results separately.
         // For now, rely on user submitting again to get new state.
      }
    } else {
      setImagePreview(null);
      setImageFileName(null);
    }
  };

  useEffect(() => {
    if (formState.data) {
      const newScan: ScanResult = {
        id: new Date().toISOString(),
        timestamp: Date.now(),
        imageUrl: imagePreview || undefined, // Storing preview URL for history
        originalImageFileName: imageFileName || 'Uploaded Image',
        extractedIngredients: formState.data.detailedIngredients,
        suggestedAlternatives: formState.data.alternatives,
      };
      setScanHistory([newScan, ...scanHistory.slice(0, 9)]); // Keep last 10 scans
      toast({
        title: "Scan Successful",
        description: "Ingredients extracted and alternatives suggested.",
        action: <CheckCircle className="text-green-500" />,
      });
    } else if (formState.error) {
       toast({
        title: "Scan Error",
        description: formState.error,
        variant: "destructive",
        action: <XCircle className="text-white" />,
      });
    } else if (formState.message) { // General message from server action
       toast({
        title: "Notification",
        description: formState.message,
        action: <AlertCircle className="text-blue-500" />,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState]); // imagePreview, imageFileName, setScanHistory, toast are stable or memoized

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset file input
    }
    // Consider resetting formState here if possible, or manage displayed results separately
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Upload Product Label</CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Capture or upload an image of the ingredient list to get insights.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              required
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
          </div>

          {imagePreview && (
            <div className="mt-4 relative group aspect-video w-full max-w-md mx-auto rounded-md overflow-hidden border shadow-sm">
              <Image src={imagePreview} alt="Image preview" layout="fill" objectFit="contain" data-ai-hint="product label"/>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleRemoveImage}
              >
                <XCircle className="h-5 w-5" />
                <span className="sr-only">Remove image</span>
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center">
          <SubmitButton />
        </CardFooter>
      </form>

      {formState.error && (
        <Alert variant="destructive" className="mt-6 mx-6 mb-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{formState.error}</AlertDescription>
        </Alert>
      )}
      
      {formState.data && (
        <div className="mt-8 p-6 border-t">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Extracted Ingredients</h2>
            <IngredientList ingredients={formState.data.detailedIngredients} />
          </div>
          <AlternativesSection alternatives={formState.data.alternatives} />
        </div>
      )}
    </Card>
  );
};

export default ImageUploadForm;
