import { Header } from '@/components/Header';
import { DashboardClient } from '@/components/DashboardClient';
import { getResources, getFilters, getUserData, getAdminResources } from '@/lib/data';
import { auth } from '@/lib/firebase';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Assuming you have this for server-side auth
import { getCurrentUser } from '@/lib/session'; // Helper to get user session server-side

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const userData = user ? await getUserData(user.uid) : null;
  const isAdmin = userData?.role === 'Admin';

  const resources = isAdmin ? await getAdminResources() : await getResources();
  const filters = getFilters();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
         <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary-foreground">
            {isAdmin ? 'Admin Dashboard' : 'Browse Resources'}
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            {isAdmin ? 'Review and manage all submitted resources.' : 'Find the materials you need for your studies.'}
          </p>
        </div>
        <DashboardClient initialResources={resources} filters={filters} isAdmin={isAdmin} />
      </main>
    </div>
  );
}

// You need to create these helper files for server-side session management if they don't exist.
// src/lib/auth.ts (example using NextAuth.js)
/*
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "./firebase";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: FirestoreAdapter(db),
  session: {
    strategy: "jwt",
  },
};
*/

// src/lib/session.ts (example)
/*
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { User } from 'firebase/auth'; // Using firebase auth user type for simplicity

export async function getCurrentUser(): Promise<User | null> {
  // This is a placeholder. You need a proper way to get the server-side user.
  // If not using NextAuth, you might need to handle this with cookies or other auth state management.
  // For this example, I'll return a mock user if you are running in a specific environment.
  // This part of the code needs to be correctly implemented based on your auth setup.
  // Since we are using firebase client-side auth, we can't easily get user on server.
  // The logic in DashboardClient will handle the client-side user check.
  return null; // Let client-side handle it.
}
*/
// For the purpose of this demo, we will rely on client-side rendering for user-specific data.
// The code above is illustrative. Let's adjust DashboardPage to reflect client-side data fetching for roles.

