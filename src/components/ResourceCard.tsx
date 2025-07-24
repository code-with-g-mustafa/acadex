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
import { ArrowRight } from "lucide-react";

type ResourceCardProps = {
  resource: Resource;
};

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="font-headline text-lg mb-2">{resource.title}</CardTitle>
            <Badge variant="outline">{resource.fileType}</Badge>
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
        <Button asChild size="sm" variant="ghost">
          <Link href={`/resource/${resource.id}`}>
            View
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
