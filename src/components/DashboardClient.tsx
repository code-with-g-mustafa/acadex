"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Resource } from '@/lib/data';
import { FilterControls } from '@/components/FilterControls';
import { ResourceList } from '@/components/ResourceList';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from './ui/skeleton';
import { getUserData, getAdminResources, getResources, updateResourceStatus } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';


type DashboardClientProps = {
  initialResources: Resource[];
  filters: {
    universities: string[];
    departments: string[];
    semesters: string[];
    subjects: { [key: string]: string[] };
  };
};

export function DashboardClient({ initialResources, filters }: DashboardClientProps) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const { toast } = useToast();

  const [resources, setResources] = useState(initialResources);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isApproving, setIsApproving] = useState<string | null>(null);

  const [university, setUniversity] = useState('all');
  const [department, setDepartment] = useState('all');
  const [semester, setSemester] = useState('all');
  const [subject, setSubject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchResources = useCallback(async (userIsAdmin: boolean) => {
    setIsLoadingData(true);
    try {
      const fetchedResources = userIsAdmin ? await getAdminResources() : await getResources();
      setResources(fetchedResources);
    } catch (error) {
      console.error("Failed to fetch resources:", error);
      toast({
        title: "Error fetching data",
        description: "Could not load resources. Please try again later.",
        variant: "destructive"
      })
    } finally {
      setIsLoadingData(false);
    }
  }, [toast]);


  useEffect(() => {
    const checkUser = async () => {
      if (loading) return; // Wait until auth state is loaded

      if (!user) {
        // Not logged in, show initial public resources
        fetchResources(false);
        return;
      }
      
      const userData = await getUserData(user.uid);
      const userIsAdmin = userData?.role === 'Admin';
      setIsAdmin(userIsAdmin);
      fetchResources(userIsAdmin);
    };

    if(mounted) {
      checkUser();
    }

  }, [user, loading, router, mounted, fetchResources]);


  const handleApprove = async (id: string) => {
    setIsApproving(id);
    try {
      await updateResourceStatus(id, 'approved');
      // Refetch all data to get the updated summary and notes
      if (user) {
          const userData = await getUserData(user.uid);
          fetchResources(userData?.role === 'Admin');
      }
      toast({ title: "Resource Approved", description: "The resource is now public and summarized." });
    } catch(error: any) {
       toast({ title: "Approval Failed", description: "The AI summary might have failed. Please try again.", variant: "destructive" });
       console.error("Approval error:", error);
    } finally {
        setIsApproving(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateResourceStatus(id, 'rejected');
      setResources(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
      toast({ title: "Resource Rejected", variant: "destructive" });
    } catch (error: any) {
       toast({ title: "Rejection Failed", description: "You may not have the required permissions.", variant: "destructive" });
    }
  };

  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      const searchMatch = searchQuery === '' ||
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (resource.tags && resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));

      return (
        (university === 'all' || resource.university === university) &&
        (department === 'all' || resource.department === department) &&
        (semester === 'all' || resource.semester === semester) &&
        (subject === 'all' || resource.subject === subject) &&
        searchMatch
      );
    });
  }, [resources, university, department, semester, subject, searchQuery]);
  
  if (isApproving) {
    return (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <h2 className="text-2xl font-semibold font-headline">AI is at work...</h2>
            <p className="text-muted-foreground">Generating summary and notes for the resource. Please wait.</p>
        </div>
    )
  }

  if (!mounted || loading || isLoadingData) {
    return (
       <div className="space-y-8">
        <Card>
          <CardContent className="p-4">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Skeleton className="h-10 lg:col-span-2" />
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
                 <Skeleton className="h-10" />
              </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
           <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <FilterControls
        filters={filters}
        setUniversity={setUniversity}
        setDepartment={setDepartment}
        setSemester={setSemester}
        setSubject={setSubject}
        setSearchQuery={setSearchQuery}
        currentDepartment={department}
        currentUniversity={university}
      />
      <ResourceList 
        resources={filteredResources} 
        isAdmin={isAdmin}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
