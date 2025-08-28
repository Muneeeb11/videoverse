'use client';

import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { User, Video } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import VideoCard from '@/components/video-card';
import { Skeleton } from '@/components/ui/skeleton';
import { CameraOff } from 'lucide-react';

export default function ProfilePage() {
  const params = useParams();
  const { username } = params;

  const [user, setUser] = useState<User | null>(null);
  const [userVideos, setUserVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;

    const fetchProfileData = async () => {
      setLoading(true);
      const profileUsername = Array.isArray(username) ? username[0] : username;
      
      const usersQuery = query(collection(db, 'users'), where('username', '==', profileUsername));
      const usersSnapshot = await getDocs(usersQuery);

      if (usersSnapshot.empty) {
        notFound();
        return;
      }
      
      const userData = { id: usersSnapshot.docs[0].id, ...usersSnapshot.docs[0].data() } as User;
      setUser(userData);

      const videosQuery = query(collection(db, 'videos'), where('uploaderId', '==', userData.id));
      const videosSnapshot = await getDocs(videosQuery);
      const videosData = videosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Video[];
      setUserVideos(videosData);

      setLoading(false);
    };

    fetchProfileData();
  }, [username]);

  if (loading) {
    return (
        <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 mb-12">
            <Skeleton className="h-36 w-36 rounded-full" />
            <div className="space-y-3 text-center md:text-left">
                <Skeleton className="h-12 w-64" />
                <Skeleton className="h-6 w-40" />
            </div>
        </div>
        <div>
            <Skeleton className="h-10 w-48 mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {[...Array(4)].map((_, i) => (
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
        </div>
    );
  }

  if (!user) {
    return notFound();
  }


  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 mb-16">
        <Avatar className="h-36 w-36 border-4 border-primary">
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback className="text-5xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className='text-center md:text-left'>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">{user.name}</h1>
          <p className="text-xl text-muted-foreground mt-1">@{user.username}</p>
        </div>
      </div>
      
      <div>
        <h2 className="text-3xl font-bold mb-8 border-b border-border/40 pb-4">
          {user.name}'s Videos
        </h2>
        {userVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {userVideos.map((video) => (
              <VideoCard key={video.id} video={video} uploader={user} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-secondary/50 rounded-xl flex flex-col items-center">
            <CameraOff className="w-20 h-20 text-muted-foreground mb-6" />
            <h2 className="text-3xl font-semibold mb-2">No Videos Yet</h2>
            <p className="text-muted-foreground text-lg">This user hasn't uploaded any videos.</p>
          </div>
        )}
      </div>
    </div>
  );
}
