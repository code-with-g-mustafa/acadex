import { getResourceById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { AIAssistant } from '@/components/AIAssistant';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Footer } from '@/components/Footer';

function isImage(url: string) {
    return /\.(jpg|jpeg|png|webp|gif)$/.test(url);
}

export default async function ResourcePage({ params }: { params: { id: string } }) {
  const resource = await getResourceById(params.id);

  if (!resource) {
    notFound();
  }
  
  const isImageUrl = isImage(resource.fileUrl);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="font-headline text-2xl">{resource.title}</CardTitle>
                    <Badge variant="default" className="bg-accent text-accent-foreground">{resource.fileType}</Badge>
                </div>
                <CardDescription>{resource.subject} - {resource.university}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted/50 rounded-lg flex items-center justify-center p-2 border">
                    {isImageUrl ? (
                        <Image 
                            src={resource.fileUrl} 
                            alt={resource.title} 
                            width={800} 
                            height={600} 
                            className="rounded-md object-contain max-h-full max-w-full"
                        />
                    ) : (
                        <iframe 
                            src={resource.fileUrl}
                            className="w-full h-full"
                            title={resource.title}
                        />
                    )}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <AIAssistant resource={resource} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
