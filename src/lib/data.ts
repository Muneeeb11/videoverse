export type User = {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  email: string;
};

export type Video = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  uploaderId: string;
  tags: string[];
};

// This data is now seeded in Firestore and will not be used directly.
// You can remove this file or keep it for reference.
export const users: User[] = [
  { id: '1', name: 'Alice Johnson', username: 'alice', avatarUrl: 'https://i.pravatar.cc/150?u=alice', email: 'alice@example.com' },
  { id: '2', name: 'Bob Williams', username: 'bob', avatarUrl: 'https://i.pravatar.cc/150?u=bob', email: 'bob@example.com' },
  { id: '3', name: 'Charlie Brown', username: 'charlie', avatarUrl: 'https://i.pravatar.cc/150?u=charlie', email: 'charlie@example.com' },
  { id: '4', name: 'Diana Prince', username: 'diana', avatarUrl: 'https://i.pravatar.cc/150?u=diana', email: 'diana@example.com' },
];

export const videos: Video[] = [
  {
    id: '1',
    title: 'Exploring the Alps',
    description: 'A breathtaking journey through the scenic routes of the Swiss Alps. Snow-capped peaks, serene lakes, and lush green valleys await.',
    thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images_480x270/ForBiggerBlazes.jpg',
    videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    uploaderId: '1',
    tags: ['travel', 'alps', 'switzerland', 'nature', 'adventure'],
  },
  {
    id: '2',
    title: 'Ultimate Guide to Baking Sourdough',
    description: 'Learn how to bake the perfect loaf of sourdough bread from scratch. From starter to final bake, we cover all the steps.',
    thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images_480x270/ForBiggerEscapes.jpg',
    videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    uploaderId: '2',
    tags: ['baking', 'sourdough', 'cooking', 'food', 'diy'],
  },
  {
    id: '3',
    title: 'My Desk Setup Tour 2024',
    description: 'A detailed look at my productivity-focused desk setup for 2024. Featuring the latest tech and ergonomic gear.',
    thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images_480x270/ForBiggerFun.jpg',
    videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    uploaderId: '3',
    tags: ['desk setup', 'tech', 'productivity', 'home office'],
  },
  {
    id: '4',
    title: 'Acoustic Cover of a Classic Song',
    description: 'A heartfelt acoustic guitar cover of a timeless classic. Hope you enjoy my rendition!',
    thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images_480x270/ForBiggerJoyrides.jpg',
    videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    uploaderId: '4',
    tags: ['music', 'cover', 'acoustic', 'guitar'],
  },
  {
    id: '5',
    title: 'Coastal Cities of Italy',
    description: 'Join me as we explore the beautiful coastal cities of Italy, from Cinque Terre to the Amalfi Coast. Amazing views and delicious food!',
    thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images_480x270/ForBiggerMeltdowns.jpg',
    videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    uploaderId: '1',
    tags: ['travel', 'italy', 'amalfi coast', 'cinque terre'],
  },
  {
    id: '6',
    title: 'How to Make Ramen at Home',
    description: 'A simple recipe for delicious and authentic ramen at home. Forget instant noodles, this is the real deal.',
    thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images_480x270/SubaruOutbackOnStreetAndDirt.jpg',
    videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    uploaderId: '2',
    tags: ['cooking', 'ramen', 'japanese food', 'recipe'],
  },
  {
    id: '7',
    title: 'Unboxing the new M4 Tablet',
    description: 'First impressions and unboxing of the brand new M4-powered tablet. Is this the ultimate creative tool?',
    thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images_480x270/TearsOfSteel.jpg',
    videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    uploaderId: '3',
    tags: ['tech', 'unboxing', 'tablet', 'review'],
  },
  {
    id: '8',
    title: 'Live Looping with a Piano and Synth',
    description: 'A live performance creating a song from scratch using a piano, synthesizer, and a loop pedal. Music creation in real-time.',
    thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images_480x270/WeAreGoingOnBullrun.jpg',
    videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    uploaderId: '4',
    tags: ['music', 'live looping', 'piano', 'synthesizer', 'improvisation'],
  },
];
