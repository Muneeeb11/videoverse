import Link from 'next/link';
import { videos, users } from '@/lib/data';
import VideoCard from '@/components/video-card';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-foreground">Trending Videos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map((video) => {
          const uploader = users.find((user) => user.id === video.uploaderId);
          return (
            <VideoCard key={video.id} video={video} uploader={uploader} />
          );
        })}
      </div>
    </div>
  );
}
