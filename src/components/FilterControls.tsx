"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

type FilterControlsProps = {
  filters: {
    universities: string[];
    departments: string[];
    semesters: string[];
    subjects: { [key: string]: string[] };
  };
  setUniversity: (value: string) => void;
  setDepartment: (value: string) => void;
  setSemester: (value: string) => void;
  setSubject: (value: string) => void;
  setSearchQuery: (value: string) => void;
  currentUniversity: string;
  currentDepartment: string;
};

export function FilterControls({
  filters,
  setUniversity,
  setDepartment,
  setSemester,
  setSubject,
  setSearchQuery,
  currentDepartment,
}: FilterControlsProps) {

  const subjectList = filters.subjects[currentDepartment] || [];

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by title, description, or tags..."
              className="pl-10"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select onValueChange={setUniversity} defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Select University" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Universities</SelectItem>
              {filters.universities.map((uni) => (
                <SelectItem key={uni} value={uni}>{uni}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setDepartment} defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {filters.departments.map((dep) => (
                <SelectItem key={dep} value={dep}>{dep}</SelectItem>
              ))}
            </SelectContent>
          </Select>
           <Select onValueChange={setSemester} defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Select Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Semesters</SelectItem>
              {filters.semesters.map((sem) => (
                <SelectItem key={sem} value={sem}>{sem}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
