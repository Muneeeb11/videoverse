'use client';

import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc, collection, getDocs, query, where, limit, orderBy, documentId } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Video, User } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import VideoCard from '@/components/video-card';
import { Skeleton } from '@/components/ui/skeleton';

export default function VideoPage() {
  const params = useParams();
  const { id } = params;

  const [video, setVideo] = useState<Video | null>(null);
  const [uploader, setUploader] = useState<User | null>(null);
  const [moreVideos, setMoreVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<Record<string, User>>({});


  useEffect(() => {
    const fetchVideoData = async () => {
      setLoading(true);
      
      const videoId = Array.isArray(id) ? id[0] : id;

      // Fetch video
      const videoDocRef = doc(db, 'videos', videoId);
      const videoDocSnap = await getDoc(videoDocRef);

      if (!videoDocSnap.exists()) {
        notFound();
        return;
      }
      const videoData = { id: videoDocSnap.id, ...videoDocSnap.data() } as Video;
      setVideo(videoData);

      // Fetch all users at once for efficiency
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = { id: doc.id, ...doc.data() } as User;
        return acc;
      }, {} as Record<string, User>);
      setAllUsers(usersData);
      
      // Find uploader from pre-fetched users
      if (videoData.uploaderId) {
        const uploaderData = usersData[videoData.uploaderId];
        if (uploaderData) {
          setUploader(uploaderData);
        }
      }

      // Fetch more videos (excluding the current one)
      const videosQuery = query(
        collection(db, 'videos'), 
        where(documentId(), '!=', videoId), 
        limit(4)
      );
      const moreVideosSnapshot = await getDocs(videosQuery);
      const moreVideosData = moreVideosSnapshot.docs.map(doc => {
          return { id: doc.id, ...doc.data() } as Video;
      });
      
      setMoreVideos(moreVideosData);

      setLoading(false);
    };

    if (id) {
        fetchVideoData();
    }
  }, [id]);

  if (loading) {
    return (
        <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
            <Skeleton className="aspect-video w-full rounded-lg mb-6" />
            <Skeleton className="h-10 w-3/4 mb-4" />
            <div className="flex items-center gap-4 mb-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-6 w-1/4" />
            </div>
            <Separator className="my-6" />
            <Skeleton className="h-24 w-full" />
            </div>
            <div className="lg:col-span-1">
            <Skeleton className="h-8 w-1/2 mb-4" />
            <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                        <Skeleton className="h-24 w-32" />
                        <div className='space-y-2 flex-grow'>
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-2/3" />
                            <Skeleton className="h-5 w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
            </div>
        </div>
        </div>
    );
  }

  if (!video) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="aspect-video w-full bg-card rounded-lg overflow-hidden shadow-lg mb-6">
            <video
              src={video.videoUrl}
              controls
              className="w-full h-full"
              poster={video.thumbnailUrl}
            />
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-foreground">
            {video.title}
          </h1>
          
          {uploader && (
            <div className="flex items-center gap-4 mb-4">
              <Link href={`/profile/${uploader.username}`} className="flex items-center gap-3 group">
                  <Avatar>
                    <AvatarImage src={uploader.avatarUrl} alt={uploader.name} />
                    <AvatarFallback>{uploader.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-semibold text-lg group-hover:text-primary">{uploader.name}</span>
              </Link>
            </div>
          )}

          <Separator className="my-6" />

          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {video.description}
            </p>
          </div>
          
          {video.tags && video.tags.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {video.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
          )}

        </div>

        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold mb-4">More Videos</h2>
          <div className="space-y-4">
            {moreVideos.map((moreVideo) => {
              const moreVideoUploader = allUsers[moreVideo.uploaderId];
              return (
                <VideoCard key={moreVideo.id} video={moreVideo} uploader={moreVideoUploader} layout="horizontal" />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
