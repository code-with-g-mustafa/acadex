import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Resource } from "@/lib/data";
import { ArrowRight, Check, X } from "lucide-react";

type ResourceCardProps = {
  resource: Resource;
  isAdmin?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
};

export function ResourceCard({ resource, isAdmin = false, onApprove, onReject }: ResourceCardProps) {
  const isPending = resource.status === 'pending';

  return (
    <Card className={`flex flex-col h-full hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 ${isPending && isAdmin ? 'border-yellow-500 border-2' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="font-headline text-lg mb-2">{resource.title}</CardTitle>
            {isAdmin ? (
               <Badge 
                variant={
                  resource.status === 'approved' ? 'default' :
                  resource.status === 'rejected' ? 'destructive' :
                  'secondary'
                }
                className="capitalize"
              >
                {resource.status}
              </Badge>
            ) : (
              <Badge variant="outline">{resource.fileType}</Badge>
            )}
        </div>
        <CardDescription>{resource.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-sm text-muted-foreground">
          <p><span className="font-semibold">University:</span> {resource.university}</p>
          <p><span className="font-semibold">Subject:</span> {resource.subject}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
         <div className="flex flex-wrap gap-1">
          {resource.tags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
        {isAdmin && isPending ? (
          <div className="flex gap-2">
            <Button size="icon" variant="outline" className="h-8 w-8 bg-green-100 text-green-700 hover:bg-green-200" onClick={() => onApprove?.(resource.id)}>
              <Check className="h-4 w-4"/>
            </Button>
             <Button size="icon" variant="outline" className="h-8 w-8 bg-red-100 text-red-700 hover:bg-red-200" onClick={() => onReject?.(resource.id)}>
              <X className="h-4 w-4"/>
            </Button>
          </div>
        ) : (
          <Button asChild size="sm" variant="ghost" disabled={resource.status !== 'approved'}>
            <Link href={`/resource/${resource.id}`}>
              View
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
