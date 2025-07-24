import { Header } from '@/components/Header';
import { UploadForm } from '@/components/UploadForm';
import { getFilters } from '@/lib/data';

export default function UploadPage() {
  const filters = getFilters();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary-foreground">
              Upload a Resource
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Share your academic materials with the community.
            </p>
          </div>
          <UploadForm filters={filters} />
        </div>
      </main>
    </div>
  );
}