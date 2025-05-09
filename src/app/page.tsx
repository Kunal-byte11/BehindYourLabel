import ImageUploadForm from '@/components/ImageUploadForm';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full py-2">
      <ImageUploadForm />
    </div>
  );
}
