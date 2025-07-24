"use client";

import { useState, useEffect, useMemo } from 'react';
import type { Resource } from '@/lib/data';
import { FilterControls } from '@/components/FilterControls';
import { ResourceList } from '@/components/ResourceList';

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
  const [university, setUniversity] = useState('all');
  const [department, setDepartment] = useState('all');
  const [semester, setSemester] = useState('all');
  const [subject, setSubject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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

  if (!mounted) {
    return null; // or a loading skeleton
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
