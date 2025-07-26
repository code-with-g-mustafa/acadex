"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { UserInfoDialog } from "./UserInfoDialog";
import { getDynamicFilters, UserData } from "@/lib/data";
import { ThemeToggle } from "./ThemeToggle";


const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function Header() {
  const [user, loading] = useAuthState(auth);
  const [isUserInfoDialogOpen, setIsUserInfoDialogOpen] = useState(false);
  const [filters, setFilters] = useState<{ universities: string[]; departments: string[]; }>({ universities: [], departments: [] });

  useEffect(() => {
    async function fetchFilters() {
      const dynamicFilters = await getDynamicFilters();
      setFilters({
        universities: dynamicFilters.universities,
        departments: dynamicFilters.departments,
      });
    }
    fetchFilters();
  }, []);


  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const loggedInUser = result.user;
      if (loggedInUser) {
        const userRef = doc(db, "users", loggedInUser.uid);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
          // First time user, open dialog to collect info
          setIsUserInfoDialogOpen(true);
        }
      }
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  const handleSaveUserInfo = async (data: { university: string, department: string, isNewUniversity: boolean, isNewDepartment: boolean }) => {
     if (user) {
        const userRef = doc(db, "users", user.uid);
        
        // This logic is now handled in RegisterForm and UserInfoDialog
        // For Google Sign-in, we need to add the new uni/dept if they exist
        if (data.isNewUniversity) {
            const uniRef = doc(db, 'metadata', 'universities');
            const uniDoc = await getDoc(uniRef);
            if(uniDoc.exists()) {
                const existingList = uniDoc.data().list || [];
                await setDoc(uniRef, { list: [...existingList, data.university] }, { merge: true });
            }
        }
        if (data.isNewDepartment) {
            const deptRef = doc(db, 'metadata', 'departments');
            const deptDoc = await getDoc(deptRef);
            if(deptDoc.exists()) {
                const existingList = deptDoc.data().list || [];
                await setDoc(deptRef, { list: [...existingList, data.department] }, { merge: true });
            }
        }

        const userData: Partial<UserData> = {
            name: user.displayName || 'Anonymous',
            email: user.email,
            role: "Student", // default role
            university: data.university,
            department: data.department,
        }

        await setDoc(userRef, userData, { merge: true });
    }
    setIsUserInfoDialogOpen(false);
  };


  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
             {user && (
              <>
               <Link href="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">Dashboard</Link>
               <Link href="/my-uploads" className="text-muted-foreground transition-colors hover:text-foreground">My Uploads</Link>
              </>
             )}
          </nav>
          <div className="hidden md:flex items-center gap-4">
             {loading ? (
                <Button variant="ghost" className="w-24 animate-pulse"></Button>
              ) : user ? (
                <>
                 <Button asChild>
                    <Link href="/upload">Upload</Link>
                  </Button>
                  <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
                </>
              ) : (
                <Button asChild>
                  <Link href="/login">Login</Link>
                </Button>
              )}
              <ThemeToggle />
          </div>
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="grid gap-6 p-6">
                  <Link href="/" className="flex items-center gap-2">
                    <Logo />
                  </Link>
                  <nav className="grid gap-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    ))}
                     {user && (
                        <>
                          <Link href="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">Dashboard</Link>
                          <Link href="/my-uploads" className="text-muted-foreground transition-colors hover:text-foreground">My Uploads</Link>
                        </>
                     )}
                  </nav>
                  <div className="flex flex-col gap-4">
                    {loading ? (
                        <Button variant="ghost" className="w-full animate-pulse"></Button>
                    ) : user ? (
                        <>
                          <Button asChild>
                            <Link href="/upload">Upload</Link>
                          </Button>
                          <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
                        </>
                      ) : (
                        <Button asChild>
                          <Link href="/login">Login</Link>
                        </Button>
                      )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <UserInfoDialog
        isOpen={isUserInfoDialogOpen}
        onClose={() => setIsUserInfoDialogOpen(false)}
        onSave={handleSaveUserInfo}
        filters={filters}
        handleGoogleSignIn={handleGoogleSignIn}
      />
    </>
  );
}
