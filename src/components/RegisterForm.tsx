
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
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
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import Link from 'next/link';
import { addUniversity, addDepartment, UserData } from '@/lib/data';


const formSchema = z.object({
  email: z.string().email('Please enter a valid email.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  university: z.string().min(1, 'Please select a university.'),
  otherUniversity: z.string().optional(),
  department: z.string().min(1, 'Please select a department.'),
  otherDepartment: z.string().optional(),
}).refine(data => {
    if (data.university === 'Other') return !!data.otherUniversity && data.otherUniversity.length > 0;
    return true;
}, { message: "Please specify the university name", path: ["otherUniversity"] })
.refine(data => {
    if (data.department === 'Other') return !!data.otherDepartment && data.otherDepartment.length > 0;
    return true;
}, { message: "Please specify the department name", path: ["otherDepartment"] });

type RegisterFormProps = {
  filters: {
    universities: string[];
    departments: string[];
  };
};

export function RegisterForm({ filters }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      university: '',
      otherUniversity: '',
      department: '',
      otherDepartment: '',
    },
  });
  
  const university = form.watch('university');
  const department = form.watch('department');


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;
      
      const isNewUniversity = values.university === 'Other';
      const isNewDepartment = values.department === 'Other';
      const universityToSave = isNewUniversity ? values.otherUniversity! : values.university;
      const departmentToSave = isNewDepartment ? values.otherDepartment! : values.department;

      // Add new university/department to the dynamic lists if they are new
      if (isNewUniversity) {
          await addUniversity(universityToSave);
      }
      if (isNewDepartment) {
          await addDepartment(departmentToSave);
      }

      const userData: Partial<UserData> = {
        name: user.email?.split('@')[0] || 'Anonymous',
        email: user.email,
        university: universityToSave,
        department: departmentToSave,
        role: 'Student', // Default role
      };

      // Save additional user info to Firestore
      await setDoc(doc(db, 'users', user.uid), userData);

      toast({
        title: "Registration Successful!",
        description: "Your account has been created.",
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed!",
        description: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="university"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>University</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your university" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filters.universities.map((uni) => (
                        <SelectItem key={uni} value={uni}>{uni}</SelectItem>
                      ))}
                       <SelectItem value="Other">Other</SelectItem>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filters.departments.map((dep) => (
                        <SelectItem key={dep} value={dep}>{dep}</SelectItem>
                      ))}
                      <SelectItem value="Other">Other</SelectItem>
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
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Register'
              )}
            </Button>
          </form>
        </Form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
