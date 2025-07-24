"use client";

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { getResourcesByUploader, Resource } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function MyUploadsClient() {
  const [user, loadingAuth] = useAuthState(auth);
  const router = useRouter();
  const [uploads, setUploads] = useState<Resource[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (loadingAuth) return;
    if (!user) {
      router.push('/');
      return;
    }

    const fetchUploads = async () => {
      try {
        const userUploads = await getResourcesByUploader(user.uid);
        setUploads(userUploads);
      } catch (error) {
        console.error("Failed to fetch user uploads:", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchUploads();
  }, [user, loadingAuth, router]);

  if (loadingAuth || loadingData) {
    return (
        <div className="space-y-4">
             <Skeleton className="h-12 w-full" />
             <Skeleton className="h-12 w-full" />
             <Skeleton className="h-12 w-full" />
        </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-center">Status</TableHead>
             <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {uploads.length > 0 ? (
            uploads.map((upload) => (
              <TableRow key={upload.id}>
                <TableCell className="font-medium">{upload.title}</TableCell>
                <TableCell>{upload.subject}</TableCell>
                <TableCell>{upload.fileType}</TableCell>
                <TableCell className="text-center">
                  <Badge 
                    variant={
                      upload.status === 'approved' ? 'default' :
                      upload.status === 'rejected' ? 'destructive' :
                      'secondary'
                    }
                    className="capitalize"
                  >
                    {upload.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                   <Button asChild variant="ghost" size="sm" disabled={upload.status !== 'approved'}>
                      <Link href={`/resource/${upload.id}`}>
                        View
                      </Link>
                    </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                You haven't uploaded any resources yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
