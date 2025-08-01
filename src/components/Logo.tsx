import { GraduationCap } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <GraduationCap className="h-6 w-6 text-primary" />
      <span className="text-xl font-bold font-headline text-foreground">
        Acadex
      </span>
    </div>
  );
}
