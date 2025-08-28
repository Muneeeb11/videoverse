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
  likes: string[]; // Array of user IDs who liked the video
  createdAt: any; // Firestore Timestamp
};

export type Comment = {
  id: string;
  text: string;
  userId: string;
  username: string;
  avatarUrl: string;
  createdAt: any; // Firestore Timestamp
};
