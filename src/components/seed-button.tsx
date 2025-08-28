'use client';

import { useState } from 'react';
import { seedDatabase } from '@/lib/seed';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw } from 'lucide-react';

export default function SeedButton() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSeed = async () => {
    setLoading(true);
    const result = await seedDatabase();
    if (result.success) {
      toast({
        title: 'Database Seeded',
        description: result.message,
      });
      // A full page reload is a simple way to reflect the new data
      window.location.reload(); 
    } else {
      toast({
        title: 'Error',
        description: result.message,
        variant: 'destructive',
      });
    }
    setLoading(false);
  };

  return (
    <div className="text-center py-16 bg-card rounded-lg flex flex-col items-center gap-4">
        <p className="text-muted-foreground">Your database is empty. Add some sample videos to get started.</p>
        <Button onClick={handleSeed} disabled={loading}>
            {loading ? (
                <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Seeding...
                </>
            ) : 'Seed Database'}
        </Button>
    </div>
  );
}
