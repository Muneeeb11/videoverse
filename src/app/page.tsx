'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
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
        // First, fetch all users and create a map for easy lookup
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersData = usersSnapshot.docs.reduce((acc, doc) => {
          acc[doc.id] = { id: doc.id, ...doc.data() } as User;
          return acc;
        }, {} as Record<string, User>);
        setUsers(usersData);
        
        // Then, fetch videos
        const videosQuery = query(collection(db, "videos"), orderBy('createdAt', 'desc'));
        let videosSnapshot = await getDocs(videosQuery);
        
        // If the database is empty, seed it
        if (videosSnapshot.empty) {
            console.log('No videos found, seeding database...');
            const seedResult = await seedDatabase();
            if (seedResult.success) {
                toast({
                    title: "Welcome!",
                    description: "We've added some sample videos for you.",
                });
                // Re-fetch the data after seeding
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

      } catch (error: any) {
        console.error("Error fetching data:", error);
        // Display a more specific error if it's a permission issue
        if (error.code === 'permission-denied') {
             toast({
                title: "Permissions Error",
                description: "Could not fetch video data. Please check Firestore security rules.",
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-foreground">Trending Videos</h1>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
