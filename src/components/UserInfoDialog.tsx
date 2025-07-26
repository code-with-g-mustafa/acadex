
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from './ui/input';

const formSchema = z.object({
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


type UserInfoDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { university: string, department: string, isNewUniversity: boolean, isNewDepartment: boolean }) => void;
  filters: {
    universities: string[];
    departments: string[];
  };
  handleGoogleSignIn: () => void;
};

export function UserInfoDialog({ isOpen, onClose, onSave, filters }: UserInfoDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      university: '',
      otherUniversity: '',
      department: '',
      otherDepartment: '',
    },
  });

  const university = form.watch('university');
  const department = form.watch('department');

  function onSubmit(values: z.infer<typeof formSchema>) {
    const isNewUniversity = values.university === 'Other';
    const isNewDepartment = values.department === 'Other';
    const universityToSave = isNewUniversity ? values.otherUniversity! : values.university;
    const departmentToSave = isNewDepartment ? values.otherDepartment! : values.department;
    onSave({ university: universityToSave, department: departmentToSave, isNewUniversity, isNewDepartment });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome to Acadex!</DialogTitle>
          <DialogDescription>
            Please provide some information to personalize your experience.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            <DialogFooter>
              <Button type="submit">Save and Continue</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
