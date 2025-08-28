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
        <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 mb-12">
            <Skeleton className="h-32 w-32 rounded-full" />
            <div className="space-y-2">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-6 w-40" />
            </div>
        </div>
        <div>
            <Skeleton className="h-10 w-48 mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 mb-12">
        <Avatar className="h-32 w-32 border-4 border-primary">
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">{user.name}</h1>
          <p className="text-lg text-muted-foreground">@{user.username}</p>
        </div>
      </div>
      
      <div>
        <h2 className="text-3xl font-bold mb-8 border-b pb-2">
          {user.name}'s Videos
        </h2>
        {userVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {userVideos.map((video) => (
              <VideoCard key={video.id} video={video} uploader={user} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-lg">
            <p className="text-muted-foreground">This user hasn't uploaded any videos yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
