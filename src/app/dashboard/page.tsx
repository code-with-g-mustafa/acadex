import { Header } from '@/components/Header';
import { DashboardClient } from '@/components/DashboardClient';
import { getFilters } from '@/lib/data';

export default async function DashboardPage() {
  // Data fetching logic is now handled entirely in DashboardClient.
  // We pass an empty array for initialResources to prevent server-side fetching
  // and let the client handle its own data needs based on user role.
  const filters = getFilters();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
         <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary-foreground">
            Browse Resources
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Find the materials you need for your studies.
          </p>
        </div>
        <DashboardClient initialResources={[]} filters={filters} />
      </main>
    </div>
  );
}
