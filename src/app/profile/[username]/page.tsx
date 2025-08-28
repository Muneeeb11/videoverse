import { notFound } from 'next/navigation';
import Image from 'next/image';
import { users, videos } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import VideoCard from '@/components/video-card';

export default function ProfilePage({ params }: { params: { username: string } }) {
  const user = users.find((u) => u.username === params.username);

  if (!user) {
    notFound();
  }

  const userVideos = videos.filter((v) => v.uploaderId === user.id);

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
