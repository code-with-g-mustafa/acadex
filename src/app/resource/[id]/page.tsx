import { getResourceById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { AIAssistant } from '@/components/AIAssistant';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';

export default async function ResourcePage({ params }: { params: { id: string } }) {
  const resource = getResourceById(params.id);

  if (!resource) {
    notFound();
  }

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
                <div className="aspect-[4/3] bg-muted/50 rounded-lg flex items-center justify-center p-8 border-dashed border-2">
                   <div className="text-center text-muted-foreground">
                    <FileText className="w-16 h-16 mx-auto" />
                    <p className="mt-4 font-semibold">Document Preview</p>
                    <p className="text-sm">Interactive PDF viewer would be rendered here.</p>
                   </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <AIAssistant resource={resource} />
          </div>
        </div>
      </main>
    </div>
  );
}
