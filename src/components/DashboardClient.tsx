"use client";

import { useState, useEffect, useMemo } from 'react';
import type { Resource } from '@/lib/data';
import { FilterControls } from '@/components/FilterControls';
import { ResourceList } from '@/components/ResourceList';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from './ui/skeleton';

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

  const [university, setUniversity] = useState('all');
  const [department, setDepartment] = useState('all');
  const [semester, setSemester] = useState('all');
  const [subject, setSubject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);


  const filteredResources = useMemo(() => {
    return initialResources.filter(resource => {
      const searchMatch = searchQuery === '' ||
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      return (
        (university === 'all' || resource.university === university) &&
        (department === 'all' || resource.department === department) &&
        (semester === 'all' || resource.semester === semester) &&
        (subject === 'all' || resource.subject === subject) &&
        searchMatch
      );
    });
  }, [initialResources, university, department, semester, subject, searchQuery]);

  if (!mounted || loading) {
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
      <ResourceList resources={filteredResources} />
    </div>
  );
}
