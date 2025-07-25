import { ResourceCard } from "@/components/ResourceCard";
import type { Resource } from "@/lib/data";

type ResourceListProps = {
  resources: Resource[];
  isAdmin?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  isProcessing?: string | null;
};

export function ResourceList({ resources, isAdmin = false, onApprove, onReject, isProcessing }: ResourceListProps) {
  if (resources.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold font-headline">No Resources Found</h2>
        <p className="text-muted-foreground mt-2">
          Try adjusting your filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map((resource) => (
        <ResourceCard 
          key={resource.id} 
          resource={resource}
          isAdmin={isAdmin}
          onApprove={onApprove}
          onReject={onReject}
          isProcessing={isProcessing === resource.id}
        />
      ))}
    </div>
  );
}
