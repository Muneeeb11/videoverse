import Link from 'next/link';
import Image from 'next/image';
import type { Video, User } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from './ui/card';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';

type VideoCardProps = {
  video: Video;
  uploader?: User;
  layout?: 'vertical' | 'horizontal';
};

export default function VideoCard({ video, uploader, layout = 'vertical' }: VideoCardProps) {
    if (layout === 'horizontal') {
        return (
            <Link href={`/video/${video.id}`} className="group">
                <div className={cn("flex gap-4 transition-opacity duration-200 ease-in-out hover:opacity-80")}>
                    <div className="aspect-video w-40 relative flex-shrink-0 overflow-hidden rounded-lg">
                        <Image
                        src={video.thumbnailUrl}
                        alt={video.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        data-ai-hint="video thumbnail"
                        />
                    </div>
                    <div className="py-1 flex flex-col">
                        <h3 className="font-semibold text-base leading-tight mb-1 group-hover:text-primary transition-colors">
                        {video.title}
                        </h3>
                        {uploader ? (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{uploader.name}</span>
                            </div>
                        ) : (
                            <Skeleton className="h-5 w-24 mt-1" />
                        )}
                         <p className="text-xs text-muted-foreground mt-1">
                            {video.likes.length} likes &middot; {video.createdAt?.toDate().toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </Link>
        )
    }

    return (
        <Link href={`/video/${video.id}`} className="group">
            <div className="flex flex-col h-full">
                <div className="aspect-video relative w-full overflow-hidden rounded-xl shadow-md">
                    <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    fill
                    className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    data-ai-hint="video thumbnail"
                    />
                </div>
                <div className="pt-4 flex gap-3">
                    {uploader ? (
                         <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarImage src={uploader.avatarUrl} alt={uploader.name} />
                            <AvatarFallback>{uploader.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    ) : (
                        <Skeleton className="h-10 w-10 rounded-full" />
                    )}
                    <div className="flex-grow">
                        <h3 className="font-semibold text-lg leading-snug truncate group-hover:text-primary transition-colors">
                            {video.title}
                        </h3>
                         {uploader ? (
                            <p className="text-sm text-muted-foreground mt-1">{uploader.name}</p>
                        ) : (
                            <Skeleton className="h-5 w-24 mt-1" />
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
