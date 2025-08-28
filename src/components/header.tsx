import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Upload, LogIn, Video } from 'lucide-react';
import { Logo } from './icons';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Logo className="h-6 w-6 text-primary" />
            <span className="font-headline">VideoVerse</span>
          </Link>
        </div>
        <nav className="flex flex-1 items-center space-x-4">
          {/* Add more nav links here if needed */}
        </nav>
        <div className="flex items-center justify-end space-x-2">
          <Button asChild>
            <Link href="/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/login">
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
