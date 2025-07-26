import { Header } from '@/components/Header';
import { DashboardClient } from '@/components/DashboardClient';
import { getDynamicFilters } from '@/lib/data';
import { Footer } from '@/components/Footer';

export default async function DashboardPage() {
  const filters = await getDynamicFilters();

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
      <Footer />
    </div>
  );
}
