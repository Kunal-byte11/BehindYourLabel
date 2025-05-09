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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadCloud, XCircle, CheckCircle, AlertCircle, Image as ImageIcon, Camera, VideoOff, RefreshCw } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import IngredientList from './IngredientList';
import AlternativesSection from './AlternativesSection';
import { useToast } from "@/hooks/use-toast";

const initialState: { data: ProcessedScanData | null; error: string | null; message?: string } = {
  data: null,
  error: null,
};

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      disabled={pending || disabled} 
      className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground opacity-100 hover:opacity-90 disabled:opacity-50"
    >
      {pending ? <LoadingSpinner className="h-5 w-5 mr-2" /> : <UploadCloud className="mr-2 h-5 w-5" />}
      {pending ? 'Analyzing...' : 'Scan Ingredients'}
    </Button>
  );
}

const ImageUploadForm = () => {
  const [formState, formActionFn, isPending] = useActionState(processImageAction, initialState);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanHistory, setScanHistory] = useLocalStorage<ScanResult[]>('scanHistory', []);
  const { toast } = useToast();
  const [showResults, setShowResults] = useState(false);
  const [captureMode, setCaptureMode] = useState<'file' | 'camera'>('file');
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCameraStreaming, setIsCameraStreaming] = useState(false);
  const [capturedCameraFile, setCapturedCameraFile] = useState<File | null>(null);

  const requestCameraPermission = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setHasCameraPermission(false);
      toast({ variant: 'destructive', title: 'Camera Not Supported', description: 'Your browser does not support camera access.' });
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraStreaming(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      setIsCameraStreaming(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings.',
      });
    }
  };

  useEffect(() => {
    if (captureMode === 'camera' && hasCameraPermission === null) {
      requestCameraPermission();
    }
    // Cleanup camera stream when switching mode or unmounting
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        setIsCameraStreaming(false);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captureMode]);


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCapturedCameraFile(null); // Clear any camera capture
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

  const handleCaptureImage = async () => {
    if (videoRef.current && canvasRef.current && isCameraStreaming) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg');
        setImagePreview(dataUri);
        
        const blob = await fetch(dataUri).then(res => res.blob());
        const fileName = `capture-${new Date().toISOString()}.jpg`;
        const file = new File([blob], fileName, { type: 'image/jpeg' });
        
        setCapturedCameraFile(file);
        setImageFileName(fileName);
        setShowResults(false);

        // Stop camera stream after capture
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            setIsCameraStreaming(false);
        }
      }
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
    setCapturedCameraFile(null);
    setShowResults(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; 
    }
    if (captureMode === 'camera' && hasCameraPermission && !isCameraStreaming) {
      requestCameraPermission(); // Restart camera if it was stopped by capture
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // For useActionState, formData is implicitly passed.
    // We need to ensure the 'image' field in formData is correct.
    // If using camera, the capturedCameraFile is the source.
    // If using file upload, the fileInputRef is the source.
    
    // Server action `processImageAction` handles FormData.
    // We construct it on the client and ensure 'image' is correctly populated.
    const formData = new FormData(event.currentTarget as HTMLFormElement);

    if (captureMode === 'camera' && capturedCameraFile) {
        formData.set('image', capturedCameraFile, capturedCameraFile.name);
    } else if (captureMode === 'file' && fileInputRef.current?.files?.[0]) {
        // File is already part of FormData via the input element
    } else if (!imagePreview) { // No image selected from any source
        event.preventDefault(); // Prevent submission
        toast({ title: "No Image", description: "Please select an image or capture one to scan.", variant: "destructive" });
        return;
    }
    // `formActionFn` will be called with this formData if `type="submit"` is used on button
    // Or, if we preventDefault, we must call it manually: `formActionFn(formData);`
    // Let useActionState handle it by not calling preventDefault unless necessary
  };


  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl rounded-xl overflow-hidden">
      <CardHeader className="bg-muted/50 p-6">
        <CardTitle className="text-3xl font-bold text-center text-primary">
          <ImageIcon className="inline-block mr-2 h-8 w-8" />
          Inside Label
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground text-base">
          Upload an image of the ingredient list or use your camera.
        </CardDescription>
      </CardHeader>
      
      <Tabs value={captureMode} onValueChange={(value) => setCaptureMode(value as 'file' | 'camera')} className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-none">
          <TabsTrigger value="file" className="py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-inner">
            <UploadCloud className="mr-2 h-5 w-5" /> Upload File
          </TabsTrigger>
          <TabsTrigger value="camera" className="py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-inner">
            <Camera className="mr-2 h-5 w-5" /> Use Camera
          </TabsTrigger>
        </TabsList>

        <form action={formActionFn} onSubmit={handleSubmit}>
          <CardContent className="p-6 space-y-6">
            <TabsContent value="file" className="mt-0">
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
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                />
                {imageFileName && captureMode === 'file' && <p className="text-xs text-muted-foreground mt-1">Selected: {imageFileName}</p>}
              </div>
            </TabsContent>

            <TabsContent value="camera" className="mt-0">
              <div className="space-y-4">
                {hasCameraPermission === false && (
                  <Alert variant="destructive">
                    <VideoOff className="h-4 w-4" />
                    <AlertTitle>Camera Access Denied or Unavailable</AlertTitle>
                    <AlertDescription>
                      Please grant camera permission in your browser settings or ensure a camera is connected.
                      <Button variant="outline" size="sm" onClick={requestCameraPermission} className="ml-2 mt-2 sm:mt-0">
                        <RefreshCw className="mr-2 h-4 w-4" /> Retry Permission
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}

                {hasCameraPermission === true && !imagePreview && (
                  <div className="relative aspect-video w-full max-w-md mx-auto rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/50 shadow-inner bg-muted/30 flex items-center justify-center">
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                    {!isCameraStreaming && hasCameraPermission && (
                       <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                        <LoadingSpinner className="h-10 w-10 text-white" />
                        <p className="text-white mt-2">Starting camera...</p>
                      </div>
                    )}
                  </div>
                )}
                
                {captureMode === 'camera' && hasCameraPermission === true && !imagePreview && isCameraStreaming && (
                  <Button type="button" onClick={handleCaptureImage} className="w-full sm:w-auto" variant="outline">
                    <Camera className="mr-2 h-5 w-5" /> Capture Image
                  </Button>
                )}
                <canvas ref={canvasRef} className="hidden"></canvas>
              </div>
            </TabsContent>

            {(imagePreview && !showResults) && ( 
              <div className="mt-4 relative group aspect-video w-full max-w-md mx-auto rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/50 shadow-inner bg-muted/30 flex items-center justify-center">
                <Image src={imagePreview} alt="Image preview" layout="fill" objectFit="contain" data-ai-hint="product label preview"/>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-70 group-hover:opacity-100 transition-opacity z-10 h-8 w-8 sm:h-9 sm:w-9"
                  onClick={handleRemoveImage}
                  aria-label="Remove image"
                >
                  <XCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-center p-6 border-t bg-muted/30">
            <SubmitButton disabled={!imagePreview && !capturedCameraFile} />
          </CardFooter>
        </form>
      </Tabs>


      {showResults && (
        <div className="p-6 border-t">
          {isPending && !formState.data && !formState.error && ( // Show main loading only if no results/error yet
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
                  <div className="relative group aspect-video w-full max-w-md mx-auto rounded-lg overflow-hidden border shadow-md">
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
              
              <AlternativesSection alternatives={formState.data.alternatives} />
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default ImageUploadForm;