'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, where, documentId } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Video, User } from '@/lib/data';
import VideoCard from '@/components/video-card';
import { Skeleton } from '@/components/ui/skeleton';
import { seedDatabase } from '@/lib/seed';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchVideosAndUsers = async () => {
      setLoading(true);
      try {
        // First, fetch videos
        const videosQuery = query(collection(db, "videos"), orderBy('createdAt', 'desc'));
        let videosSnapshot = await getDocs(videosQuery);
        
        // If the database is empty, seed it and refetch
        if (videosSnapshot.empty) {
            console.log('No videos found, seeding database...');
            const seedResult = await seedDatabase();
            if (seedResult.success) {
                toast({
                    title: "Welcome!",
                    description: "We've added some sample videos for you.",
                });
                videosSnapshot = await getDocs(videosQuery);
            } else {
                toast({
                    title: "Error",
                    description: "Could not load sample videos.",
                    variant: "destructive",
                });
                setLoading(false);
                return;
            }
        }
        
        const videosData = videosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Video[];
        setVideos(videosData);

        // If there are videos, fetch the corresponding users
        if (videosData.length > 0) {
          const uploaderIds = [...new Set(videosData.map(v => v.uploaderId))];
          if (uploaderIds.length > 0) {
            const usersQuery = query(collection(db, "users"), where(documentId(), 'in', uploaderIds));
            const usersSnapshot = await getDocs(usersQuery);
            const usersData = usersSnapshot.docs.reduce((acc, doc) => {
              acc[doc.id] = { id: doc.id, ...doc.data() } as User;
              return acc;
            }, {} as Record<string, User>);
            setUsers(usersData);
          }
        }

      } catch (error: any) {
        console.error("Error fetching data:", error);
        // Display a more specific error if it's a permission issue
        if (error.code === 'permission-denied' || error.code === 'failed-precondition') {
             toast({
                title: "Permissions Error",
                description: "Could not fetch data. Please check Firestore security rules and ensure indexes are built.",
                variant: "destructive",
            });
        } else {
            toast({
                title: "Error",
                description: "Could not fetch video data.",
                variant: "destructive",
            });
        }
      }
      setLoading(false);
    };

    fetchVideosAndUsers();
  }, [toast]);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold mb-10 tracking-tight text-foreground">Trending Videos</h1>
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {videos.map((video) => {
            const uploader = users[video.uploaderId];
            return (
              <VideoCard key={video.id} video={video} uploader={uploader} />
            );
          })}
        </div>
      )}
    </div>
  );
}
