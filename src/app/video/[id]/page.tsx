import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { videos, users } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import VideoCard from '@/components/video-card';

export default function VideoPage({ params }: { params: { id: string } }) {
  const video = videos.find((v) => v.id === params.id);
  if (!video) {
    notFound();
  }
  const uploader = users.find((u) => u.id === video.uploaderId);
  const moreVideos = videos.filter((v) => v.id !== video.id).slice(0, 4);

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
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {video.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>

        </div>

        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold mb-4">More Videos</h2>
          <div className="space-y-4">
            {moreVideos.map((moreVideo) => {
              const moreVideoUploader = users.find(user => user.id === moreVideo.uploaderId);
              return (
                <VideoCard key={moreVideo.id} video={moreVideo} uploader={moreVideoUploader} />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
