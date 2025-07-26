
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, Loader2, FileCheck } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { addResource } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';


const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  university: z.string().min(1, 'Please select a university.'),
  otherUniversity: z.string().optional(),
  department: z.string().min(1, 'Please select a department.'),
  otherDepartment: z.string().optional(),
  semester: z.string().min(1, 'Please select a semester.'),
  subject: z.string().min(1, 'Please select a subject.'),
  otherSubject: z.string().optional(),
  fileType: z.enum(['Note', 'Past Paper', 'Lab Manual']),
  file: z.any().refine((files) => files instanceof FileList && files?.length === 1, 'File is required.'),
}).refine(data => {
    if (data.university === 'Other') return !!data.otherUniversity && data.otherUniversity.length > 0;
    return true;
}, { message: "Please specify the university name", path: ["otherUniversity"] })
.refine(data => {
    if (data.department === 'Other') return !!data.otherDepartment && data.otherDepartment.length > 0;
    return true;
}, { message: "Please specify the department name", path: ["otherDepartment"] })
.refine(data => {
    if (data.subject === 'Other') return !!data.otherSubject && data.otherSubject.length > 0;
    return true;
}, { message: "Please specify the subject name", path: ["otherSubject"] });

type UploadFormProps = {
  filters: {
    universities: string[];
    departments: string[];
    semesters: string[];
    subjects: { [key: string]: string[] };
  };
};

export function UploadForm({ filters }: UploadFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [user] = useAuthState(auth);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      university: '',
      otherUniversity: '',
      department: '',
      otherDepartment: '',
      semester: '',
      subject: '',
      otherSubject: '',
      fileType: 'Note',
      file: undefined,
    },
  });

  const university = form.watch('university');
  const department = form.watch('department');
  const subject = form.watch('subject');
  
  const [subjectList, setSubjectList] = useState<string[]>([]);
  
  useEffect(() => {
    if (department && filters.subjects[department]) {
      setSubjectList(filters.subjects[department]);
    } else {
      setSubjectList([]);
    }
  }, [department, filters.subjects]);

  const fileList = form.watch('file');
  const fileName = fileList?.[0]?.name;


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
         toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "You must be logged in to upload a resource.",
        });
        return;
    }

    setIsLoading(true);
    
    try {
        const fileToUpload = values.file[0] as File;
        const universityToSave = values.university === 'Other' ? values.otherUniversity : values.university;
        const departmentToSave = values.department === 'Other' ? values.otherDepartment : values.department;
        const subjectToSave = values.subject === 'Other' ? values.otherSubject : values.subject;

        await addResource({
            ...values,
            university: universityToSave!,
            department: departmentToSave!,
            subject: subjectToSave!,
            file: fileToUpload,
            uploaderId: user.uid,
        });

        toast({
            title: "Upload Successful!",
            description: "Your resource has been submitted and is pending review.",
        });
        form.reset();
        router.push('/my-uploads');
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Upload Failed!",
            description: error.message || "An unknown error occurred. Please check the console for details.",
        });
        console.error("Upload error details:", error);
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Upload Resource Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                control={form.control}
                name="university"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>University</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a university" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {filters.universities.map((uni) => (
                            <SelectItem key={uni} value={uni}>{uni}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                {university === 'Other' && (
                  <FormField
                    control={form.control}
                    name="otherUniversity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>University Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter university name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue('subject', '');
                    }} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {filters.departments.map((dep) => (
                            <SelectItem key={dep} value={dep}>{dep}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 {department === 'Other' && (
                  <FormField
                    control={form.control}
                    name="otherDepartment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter department name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="semester"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Semester</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a semester" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filters.semesters.map((sem) => (
                            <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''} disabled={!department || department === ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subjectList.map((sub) => (
                            <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                       <FormDescription>
                        {!department || department === '' ? "Please select a department first." : "Select a subject from the list."}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {subject === 'Other' && (
                  <FormField
                    control={form.control}
                    name="otherSubject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter subject name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
            </div>
             <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 'Comprehensive Notes on Linked Lists'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief description of the resource."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="fileType"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>File Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a file type" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Note">Note</SelectItem>
                            <SelectItem value="Past Paper">Past Paper</SelectItem>
                            <SelectItem value="Lab Manual">Lab Manual</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <div className="relative flex justify-center w-full h-32 px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            {fileName ? (
                                <>
                                 <FileCheck className="w-12 h-12 mx-auto text-green-500"/>
                                 <p className="text-sm text-muted-foreground">{fileName}</p>
                                </>
                            ) : (
                                <>
                                 <UploadCloud className="w-12 h-12 mx-auto text-muted-foreground"/>
                                    <div className="flex text-sm text-muted-foreground">
                                        <label htmlFor="file-upload" className="relative font-medium text-primary bg-transparent rounded-md cursor-pointer focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:text-primary/80">
                                            <span>Upload a file</span>
                                            <Input id="file-upload" type="file" className="sr-only" 
                                                {...form.register("file")}
                                                accept=".pdf,.png,.jpg,.jpeg"
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-muted-foreground">PDF, PNG, JPG up to 10MB</p>
                                </>
                            )}
                        </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                    </>
                ) : (
                    'Submit'
                )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

