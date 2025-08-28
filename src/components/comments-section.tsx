
'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import type { Comment } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle } from 'lucide-react';

interface CommentsSectionProps {
  videoId: string;
}

export default function CommentsSection({ videoId }: CommentsSectionProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!videoId) return;

    const q = query(collection(db, `videos/${videoId}/comments`), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
        } as Comment;
      });
      setComments(commentsData);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching comments: ", error);
        toast({
            title: "Error",
            description: "Could not fetch comments. Please check your Firestore rules for subcollections.",
            variant: "destructive",
        });
        setLoading(false);
    });

    return () => unsubscribe();
  }, [videoId, toast]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to post a comment.",
        variant: "destructive",
      });
      return;
    }
    if (newComment.trim() === '') {
        toast({
            title: "Cannot post empty comment.",
            variant: "destructive",
        });
        return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, `videos/${videoId}/comments`), {
        text: newComment,
        userId: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl,
        createdAt: serverTimestamp(),
      });
      setNewComment('');
    } catch (error) {
      console.error("Error posting comment: ", error);
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    } finally {
        setSubmitting(false);
    }
  };

  return (
    <div className="mt-8 pt-6 border-t">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MessageCircle className="w-6 h-6"/>
        <span>{comments.length} Comment{comments.length !== 1 ? 's' : ''}</span>
      </h2>
      
      {user && (
        <form onSubmit={handleSubmit} className="mb-8 flex items-start gap-4">
          <Avatar className="mt-1">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={submitting}
              className="mb-2"
            />
            <div className="flex justify-end">
                <Button type="submit" disabled={submitting}>
                    {submitting ? 'Posting...' : 'Post Comment'}
                </Button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {loading ? (
          <>
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </>
        ) : comments.length > 0 ? (
          comments.map(comment => (
            <div key={comment.id} className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src={comment.avatarUrl} alt={comment.username}/>
                <AvatarFallback>{comment.username.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                  <Link href={`/profile/${comment.username}`} className="font-semibold hover:underline">
                    @{comment.username}
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    {comment.createdAt ? formatDistanceToNow(comment.createdAt, { addSuffix: true }) : 'just now'}
                  </span>
                </div>
                <p className="text-foreground/90 whitespace-pre-wrap">{comment.text}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-card rounded-lg">
            <p className="text-muted-foreground">Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
}
