import Link from 'next/link';
import Image from 'next/image';
import type { Video, User } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from './ui/card';

type VideoCardProps = {
  video: Video;
  uploader?: User;
};

export default function VideoCard({ video, uploader }: VideoCardProps) {
  return (
    <Link href={`/video/${video.id}`} className="group">
      <Card className="overflow-hidden h-full transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary/50">
        <CardContent className="p-0">
          <div className="aspect-video relative">
            <Image
              src={video.thumbnailUrl}
              alt={video.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="video thumbnail"
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg leading-tight truncate mb-2 group-hover:text-primary">
              {video.title}
            </h3>
            {uploader && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={uploader.avatarUrl} alt={uploader.name} />
                  <AvatarFallback>{uploader.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{uploader.name}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
