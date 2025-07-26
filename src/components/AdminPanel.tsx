"use client";

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { getUserData } from '@/lib/data';
import { Button } from './ui/button';
import { Shield, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export function AdminPanel() {
  const [user] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdminStatus() {
      if (user) {
        const userData = await getUserData(user.uid);
        if (userData?.role === 'Admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    }
    checkAdminStatus();
  }, [user]);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-5 z-50">
       <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="destructive" className="shadow-lg rounded-full pl-3 pr-2 h-auto py-1">
                <div className="flex items-center gap-2">
                    <div className='flex items-center gap-1'>
                     <Shield className="w-5 h-5" />
                    <span className="font-bold text-sm">Admin</span>
                    </div>
                    <ChevronDown className="w-4 h-4 opacity-80" />
                </div>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start" className="w-48">
            <DropdownMenuItem>Dashboard</DropdownMenuItem>
            <DropdownMenuItem>Manage Users</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuContent>
       </DropdownMenu>
    </div>
  );
}
