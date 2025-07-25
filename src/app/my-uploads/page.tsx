import { Header } from '@/components/Header';
import { MyUploadsClient } from './MyUploadsClient';
import { Footer } from '@/components/Footer';

export default function MyUploadsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary-foreground">
            My Uploads
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Track the status of your submitted resources.
          </p>
        </div>
        <MyUploadsClient />
      </main>
      <Footer />
    </div>
  );
}
