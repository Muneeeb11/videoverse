
'use client';

import { useState, useEffect, useMemo } from 'react';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc, collection, getDocs, query, where, limit, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Video, User } from '@/lib/data';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import VideoCard from '@/components/video-card';
import { Skeleton } from '@/components/ui/skeleton';
import CommentsSection from '@/components/comments-section';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function VideoPage() {
  const params = useParams();
  const { id } = params;
  const { user } = useAuth();
  const { toast } = useToast();

  const [video, setVideo] = useState<Video | null>(null);
  const [uploader, setUploader] = useState<User | null>(null);
  const [moreVideos, setMoreVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<Record<string, User>>({});

  const [isLiking, setIsLiking] = useState(false);

  const videoId = Array.isArray(id) ? id[0] : id;

  const isLiked = useMemo(() => {
    if (!video || !user) return false;
    return video.likes?.includes(user.id);
  }, [video, user]);

  const likeCount = useMemo(() => {
    return video?.likes?.length || 0;
  }, [video]);

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to like a video.",
        variant: "destructive",
      });
      return;
    }
    if (!video || isLiking) return;

    setIsLiking(true);
    const videoRef = doc(db, 'videos', videoId);

    try {
      if (isLiked) {
        // Unlike the video
        await updateDoc(videoRef, {
          likes: arrayRemove(user.id)
        });
        setVideo(prev => prev ? { ...prev, likes: prev.likes.filter(uid => uid !== user.id) } : null);
      } else {
        // Like the video
        await updateDoc(videoRef, {
          likes: arrayUnion(user.id)
        });
        setVideo(prev => prev ? { ...prev, likes: [...(prev.likes || []), user.id] } : null);
      }
    } catch (error) {
      console.error("Error updating likes:", error);
      toast({
        title: "Error",
        description: "Could not update like status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLiking(false);
    }
  };


  useEffect(() => {
    const fetchVideoData = async () => {
      setLoading(true);
      
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
        where('__name__', '!=', videoId), 
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
  }, [id, videoId]);

  if (loading) {
    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-8">
            <div className="lg:col-span-2">
            <Skeleton className="aspect-video w-full rounded-xl mb-6" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <div className="flex items-center gap-4 mb-6">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className='flex-1 space-y-2'>
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-4 w-1/6" />
                </div>
            </div>
            <Separator className="my-6" />
            <Skeleton className="h-24 w-full rounded-xl" />
            </div>
            <div className="lg:col-span-1">
            <Skeleton className="h-8 w-1/2 mb-6" />
            <div className="space-y-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                        <Skeleton className="h-24 w-40 rounded-lg" />
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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-8">
        <div className="lg:col-span-2">
          <div className="aspect-video w-full bg-card rounded-xl overflow-hidden shadow-lg mb-4">
            <video
              src={video.videoUrl}
              controls
              className="w-full h-full"
              poster={video.thumbnailUrl}
            />
          </div>

          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-4 text-foreground">
            {video.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            {uploader && (
              <Link href={`/profile/${uploader.username}`} className="flex items-center gap-4 group">
                  <Avatar className='h-12 w-12'>
                    <AvatarImage src={uploader.avatarUrl} alt={uploader.name} />
                    <AvatarFallback>{uploader.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-lg group-hover:text-primary transition-colors">{uploader.name}</p>
                    <p className="text-sm text-muted-foreground">@{uploader.username}</p>
                  </div>
              </Link>
            )}

            <div className="flex items-center gap-2">
              <Button variant="outline" size="lg" onClick={handleLike} disabled={isLiking || !user} className='rounded-full'>
                <Heart className={cn("h-5 w-5", isLiked && "fill-destructive text-destructive")} />
                <span className='ml-2 font-semibold'>{likeCount}</span>
              </Button>
            </div>
          </div>
          
          {video.tags && video.tags.length > 0 && (
            <div className="mt-4 mb-2">
              <div className="flex flex-wrap gap-2">
                {video.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
          )}


          <Separator className="my-6" />

          <div className="bg-secondary/50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {video.description}
            </p>
          </div>

          <CommentsSection videoId={video.id} />

        </div>

        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold mb-6">More Videos</h2>
          <div className="space-y-6">
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
