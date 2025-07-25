import { Header } from '@/components/Header';
import { LoginForm } from '@/components/LoginForm';
import { Footer } from '@/components/Footer';

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-md">
           <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary-foreground">
              Login
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Access your Acadex account.
            </p>
          </div>
          <LoginForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
