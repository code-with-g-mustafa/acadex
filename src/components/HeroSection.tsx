"use client";
import Link from 'next/link';
import { Button } from './ui/button';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline text-foreground">
            Unlock Your Academic Potential with Acadex
          </h1>
          <p className="text-lg text-muted-foreground">
            Your AI-powered hub for university notes, past papers, and smart study tools. Collaborate, learn, and excel together.
          </p>
          <div className="flex gap-4 justify-center md:justify-start">
            <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
              <Link href="/dashboard">Start Learning</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="shadow-sm hover:shadow-md transition-shadow">
              <Link href="/upload">Upload Notes</Link>
            </Button>
          </div>
        </div>
        <div>
          <Image
            src="https://placehold.co/600x400.png"
            alt="Hero illustration of a 3D animated character"
            width={600}
            height={400}
            className="rounded-lg shadow-xl"
            data-ai-hint="study group"
          />
        </div>
      </div>
    </section>
  );
}
