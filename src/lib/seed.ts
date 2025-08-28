
'use server';

import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from './firebase';
import type { User, Video } from './data';

// --- DUMMY DATA ---
const users: Omit<User, 'id' | 'email'>[] = [
    { name: 'Alice Johnson', username: 'alice', avatarUrl: 'https://i.pravatar.cc/150?u=alice' },
    { name: 'Bob Williams', username: 'bob', avatarUrl: 'https://i.pravatar.cc/150?u=bob' },
];

const videos: Omit<Video, 'id' | 'uploaderId'>[] = [
    {
        title: 'Exploring the Alps',
        description: 'A breathtaking journey through the scenic routes of the Swiss Alps. Snow-capped peaks, serene lakes, and lush green valleys await.',
        thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images_480x270/ForBiggerBlazes.jpg',
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        tags: ['travel', 'alps', 'switzerland', 'nature', 'adventure'],
    },
    {
        title: 'Ultimate Guide to Baking Sourdough',
        description: 'Learn how to bake the perfect loaf of sourdough bread from scratch. From starter to final bake, we cover all the steps.',
        thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images_480x270/ForBiggerEscapes.jpg',
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        tags: ['baking', 'sourdough', 'cooking', 'food', 'diy'],
    },
    {
        title: 'My Desk Setup Tour 2024',
        description: 'A detailed look at my productivity-focused desk setup for 2024. Featuring the latest tech and ergonomic gear.',
        thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images_480x270/ForBiggerFun.jpg',
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        tags: ['desk setup', 'tech', 'productivity', 'home office'],
    },
];
// --- END DUMMY DATA ---

export async function seedDatabase() {
    console.log('Checking if database needs seeding...');
    
    // Check if videos collection is empty
    const videosCollection = collection(db, 'videos');
    const videoSnapshot = await getDocs(videosCollection);
    
    if (!videoSnapshot.empty) {
        console.log('Database already has video data. Skipping seed.');
        return { success: true, message: 'Database already seeded.' };
    }

    console.log('Database is empty. Seeding data...');

    const batch = writeBatch(db);
    
    // Add users and store their new doc IDs
    const userIds: string[] = [];
    for (const userData of users) {
        // For seeding, let's create a placeholder email
        const email = `${userData.username}@example.com`;
        const userRef = doc(collection(db, 'users'));
        batch.set(userRef, { ...userData, email });
        userIds.push(userRef.id);
    }

    // Add videos, assigning a random user ID to each
    videos.forEach(videoData => {
        const videoRef = doc(collection(db, 'videos'));
        const randomUploaderId = userIds[Math.floor(Math.random() * userIds.length)];
        batch.set(videoRef, {
            ...videoData,
            uploaderId: randomUploaderId,
            createdAt: new Date(),
        });
    });

    try {
        await batch.commit();
        console.log('Database seeded successfully.');
        return { success: true, message: 'Database seeded successfully!' };
    } catch (error) {
        console.error('Error seeding database:', error);
        return { success: false, message: 'Error seeding database.' };
    }
}
