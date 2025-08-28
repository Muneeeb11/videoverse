'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Video, User } from '@/lib/data';
import VideoCard from '@/components/video-card';
import { Skeleton } from '@/components/ui/skeleton';
import { SearchX } from 'lucide-react';

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q');

  const [videos, setVideos] = useState<Video[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!q) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        // Since Firestore doesn't support case-insensitive `contains` search,
        // we fetch all videos and filter client-side. This is not scalable for large
        // datasets and a proper search solution like Algolia or Elasticsearch would be needed.
        const videosQuery = query(collection(db, "videos"), orderBy('createdAt', 'desc'));
        const videosSnapshot = await getDocs(videosQuery);
        
        const allVideos = videosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Video[];
        
        const filteredVideos = allVideos.filter(video => 
          video.title.toLowerCase().includes(q.toLowerCase()) ||
          video.tags.some(tag => tag.toLowerCase().includes(q.toLowerCase()))
        );

        setVideos(filteredVideos);
        
        if (filteredVideos.length > 0) {
          const uploaderIds = [...new Set(filteredVideos.map(v => v.uploaderId))];
          if (uploaderIds.length > 0) {
            // Firestore 'in' query is limited to 30 items in the array. For more, multiple queries would be needed.
            const usersQuery = query(collection(db, "users"), where('__name__', 'in', uploaderIds));
            const usersSnapshot = await getDocs(usersQuery);
            const usersData = usersSnapshot.docs.reduce((acc, doc) => {
              acc[doc.id] = { id: doc.id, ...doc.data() } as User;
              return acc;
            }, {} as Record<string, User>);
            setUsers(usersData);
          }
        }

      } catch (err: any) {
        console.error("Error fetching search results:", err);
        setError("Could not fetch search results. Please try again later.");
      }
      
      setLoading(false);
    };

    fetchSearchResults();
  }, [q]);

  if (!q) {
    return (
        <div className="text-center py-24">
            <h2 className="text-2xl font-semibold mb-2">Search VideoVerse</h2>
            <p className="text-muted-foreground">Enter a term in the search bar to find videos and creators.</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">
        Search results for: <span className="text-primary">&quot;{q}&quot;</span>
      </h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-xl" />
              <div className='flex items-center gap-3'>
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className='space-y-2 flex-1'>
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-24 text-destructive">
          <p>{error}</p>
        </div>
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {videos.map((video) => {
            const uploader = users[video.uploaderId];
            return (
              <VideoCard key={video.id} video={video} uploader={uploader} />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-24 bg-secondary/50 rounded-xl flex flex-col items-center">
            <SearchX className="w-20 h-20 text-muted-foreground mb-6" />
            <h2 className="text-3xl font-semibold mb-2">No videos found</h2>
            <p className="text-muted-foreground text-lg">We couldn't find anything for &quot;{q}&quot;. Try a different search.</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="container mx-auto px-4 py-12">
                <Skeleton className='h-10 w-1/2 mb-8'/>
                <div className="grid grid-cols-1 sm:grid_cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="space-y-3">
                        <Skeleton className="h-48 w-full rounded-xl" />
                        <div className='flex items-center gap-3'>
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className='space-y-2 flex-1'>
                                <Skeleton className="h-5 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </div>
                        </div>
                    ))}
                </div>
            </div>
        }>
            <SearchResults />
        </Suspense>
    )
}
