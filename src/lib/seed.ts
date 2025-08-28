'use server';

import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from './firebase';
import type { User, Video } from './data';

// --- DUMMY DATA ---
const users: Omit<User, 'id'>[] = [
    { name: 'Alice Johnson', username: 'alice', avatarUrl: 'https://i.pravatar.cc/150?u=alice', email: 'alice@example.com' },
    { name: 'Bob Williams', username: 'bob', avatarUrl: 'https://i.pravatar.cc/150?u=bob', email: 'bob@example.com' },
    { name: 'Charlie Brown', username: 'charlie', avatarUrl: 'https://i.pravatar.cc/150?u=charlie', email: 'charlie@example.com' },
    { name: 'Diana Prince', username: 'diana', avatarUrl: 'https://i.pravatar.cc/150?u=diana', email: 'diana@example.com' },
];

const videos: Omit<Video, 'id' | 'uploaderId'>[] = [
    {
        title: 'Exploring the Alps',
        description: 'A breathtaking journey through the scenic routes of the Swiss Alps. Snow-capped peaks, serene lakes, and lush green valleys await.',
        thumbnailUrl: 'https://picsum.photos/seed/alps/600/400',
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        tags: ['travel', 'alps', 'switzerland', 'nature', 'adventure'],
    },
    {
        title: 'Ultimate Guide to Baking Sourdough',
        description: 'Learn how to bake the perfect loaf of sourdough bread from scratch. From starter to final bake, we cover all the steps.',
        thumbnailUrl: 'https://picsum.photos/seed/baking/600/400',
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        tags: ['baking', 'sourdough', 'cooking', 'food', 'diy'],
    },
    {
        title: 'My Desk Setup Tour 2024',
        description: 'A detailed look at my productivity-focused desk setup for 2024. Featuring the latest tech and ergonomic gear.',
        thumbnailUrl: 'https://picsum.photos/seed/desk/600/400',
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        tags: ['desk setup', 'tech', 'productivity', 'home office'],
    },
    {
        title: 'Acoustic Cover of a Classic Song',
        description: 'A heartfelt acoustic guitar cover of a timeless classic. Hope you enjoy my rendition!',
        thumbnailUrl: 'https://picsum.photos/seed/guitar/600/400',
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        tags: ['music', 'cover', 'acoustic', 'guitar'],
    },
    {
        title: 'Coastal Cities of Italy',
        description: 'Join me as we explore the beautiful coastal cities of Italy, from Cinque Terre to the Amalfi Coast. Amazing views and delicious food!',
        thumbnailUrl: 'https://picsum.photos/seed/italy/600/400',
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        tags: ['travel', 'italy', 'amalfi coast', 'cinque terre'],
    },
    {
        title: 'How to Make Ramen at Home',
        description: 'A simple recipe for delicious and authentic ramen at home. Forget instant noodles, this is the real deal.',
        thumbnailUrl: 'https://picsum.photos/seed/ramen/600/400',
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
        tags: ['cooking', 'ramen', 'japanese food', 'recipe'],
    },
    {
        title: 'Unboxing the new M4 Tablet',
        description: 'First impressions and unboxing of the brand new M4-powered tablet. Is this the ultimate creative tool?',
        thumbnailUrl: 'https://picsum.photos/seed/tablet/600/400',
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        tags: ['tech', 'unboxing', 'tablet', 'review'],
    },
    {
        title: 'Live Looping with a Piano and Synth',
        description: 'A live performance creating a song from scratch using a piano, synthesizer, and a loop pedal. Music creation in real-time.',
        thumbnailUrl: 'https://picsum.photos/seed/piano/600/400',
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
        tags: ['music', 'live looping', 'piano', 'synthesizer', 'improvisation'],
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
    users.forEach(userData => {
        const userRef = doc(collection(db, 'users'));
        batch.set(userRef, userData);
        userIds.push(userRef.id);
    });

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
