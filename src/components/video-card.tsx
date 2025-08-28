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
                <Card className="overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary/50">
                    <CardContent className="p-0 flex">
                        <div className="aspect-video w-32 relative flex-shrink-0 overflow-hidden">
                            <Image
                            src={video.thumbnailUrl}
                            alt={video.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            data-ai-hint="video thumbnail"
                            />
                        </div>
                        <div className="p-3 flex flex-col justify-center">
                            <h3 className="font-semibold text-base leading-tight truncate mb-1 group-hover:text-primary">
                            {video.title}
                            </h3>
                            {uploader ? (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{uploader.name}</span>
                                </div>
                            ) : (
                                <Skeleton className="h-4 w-16" />
                            )}
                        </div>
                    </CardContent>
                </Card>
            </Link>
        )
    }

    return (
        <Link href={`/video/${video.id}`} className="group">
        <Card className="overflow-hidden h-full transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary/50 flex flex-col">
            <CardContent className="p-0 flex flex-col flex-grow">
            <div className="aspect-video relative w-full overflow-hidden">
                <Image
                src={video.thumbnailUrl}
                alt={video.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                data-ai-hint="video thumbnail"
                />
            </div>
            <div className="p-4 flex-grow flex flex-col">
                <h3 className="font-semibold text-lg leading-tight truncate mb-2 group-hover:text-primary">
                {video.title}
                </h3>
                {uploader ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-auto">
                        <Avatar className="h-6 w-6">
                        <AvatarImage src={uploader.avatarUrl} alt={uploader.name} />
                        <AvatarFallback>{uploader.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{uploader.name}</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 mt-auto">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-5 w-24" />
                    </div>
                )}
            </div>
            </CardContent>
        </Card>
        </Link>
    );
}
