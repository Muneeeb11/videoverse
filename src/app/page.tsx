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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchVideosAndUsers = async () => {
      setLoading(true);
      try {
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

        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as User[];
        setUsers(usersData);

      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
            title: "Error",
            description: "Could not fetch video data.",
            variant: "destructive",
        });
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
            const uploader = users.find((user) => user.id === video.uploaderId);
            return (
              <VideoCard key={video.id} video={video} uploader={uploader} />
            );
          })}
        </div>
      )}
    </div>
  );
}
