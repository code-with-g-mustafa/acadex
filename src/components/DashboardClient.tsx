
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
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

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
      const fetchedResources = await getResources();
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
      if (loading) return;

      if (!user) {
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
    setIsProcessing(id);
    try {
      setResources(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
      await updateResourceStatus(id, 'approved');
      toast({ title: "Resource Approved", description: "The resource is now public. AI summary is being generated." });

      setTimeout(() => {
        if (user) {
          getUserData(user.uid).then(userData => {
            fetchResources(userData?.role === 'Admin');
          });
        }
      }, 5000);

    } catch(error: any) {
       setResources(prev => prev.map(r => r.id === id ? { ...r, status: 'pending' } : r));
       toast({ title: "Approval Failed", description: "Could not approve the resource. Please try again.", variant: "destructive" });
       console.error("Approval error:", error);
    } finally {
        setIsProcessing(null);
    }
  };

  const handleReject = async (id: string) => {
    setIsProcessing(id);
    try {
      await updateResourceStatus(id, 'rejected');
      setResources(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
      toast({ title: "Resource Rejected", variant: "destructive" });
    } catch (error: any) {
       toast({ title: "Rejection Failed", description: "You may not have the required permissions.", variant: "destructive" });
    } finally {
        setIsProcessing(null);
    }
  };

  const filteredResources = useMemo(() => {
    let resourcesToFilter = resources;

    if (!isAdmin) {
      resourcesToFilter = resources.filter(r => r.status === 'approved');
    } else {
       resourcesToFilter = resources.sort((a, b) => {
          if (a.status === 'pending' && b.status !== 'pending') return -1;
          if (a.status !== 'pending' && b.status === 'pending') return 1;
          return 0;
      });
    }

    return resourcesToFilter.filter(resource => {
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
  }, [resources, university, department, semester, subject, searchQuery, isAdmin]);
  
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
        isProcessing={isProcessing}
      />
    </div>
  );
}
