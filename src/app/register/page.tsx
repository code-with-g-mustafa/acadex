import { Header } from '@/components/Header';
import { RegisterForm } from '@/components/RegisterForm';
import { getDynamicFilters } from '@/lib/data';
import { Footer } from '@/components/Footer';

export default async function RegisterPage() {
  const filters = await getDynamicFilters();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-md">
           <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary-foreground">
              Create an Account
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Join the Acadex community.
            </p>
          </div>
          <RegisterForm filters={filters} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
