import { Header } from '@/components/Header';
import { DashboardClient } from '@/components/DashboardClient';
import { getResources, getFilters } from '@/lib/data';

export default async function Home() {
  const resources = getResources();
  const filters = getFilters();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary-foreground">
            Welcome to ScholarSage
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Your AI-powered academic resource hub.
          </p>
        </div>
        <DashboardClient initialResources={resources} filters={filters} />
      </main>
    </div>
  );
}
