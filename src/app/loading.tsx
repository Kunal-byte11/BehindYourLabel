import LoadingSpinner from "@/components/LoadingSpinner";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
      <LoadingSpinner className="h-16 w-16" />
      <p className="mt-4 text-lg text-muted-foreground">Loading page...</p>
    </div>
  );
}
