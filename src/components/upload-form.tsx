'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UploadCloud, X } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { db, storage } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { Progress } from './ui/progress';


export default function UploadForm() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const addTag = () => {
    const newTag = tagInput.trim().toLowerCase();
    if (newTag && !tags.includes(newTag) && tags.length < 10) {
      setTags([...tags, newTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
      } else {
        toast({ title: "Invalid File", description: "Please select a valid video file.", variant: 'destructive' });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        toast({ title: "Not Authenticated", description: "You must be logged in to upload a video.", variant: 'destructive' });
        return;
    }
    if (!videoFile || !title) {
        toast({ title: "Missing Fields", description: "Please provide a title and a video file.", variant: 'destructive' });
        return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const videoFileRef = ref(storage, `videos/${user.id}/${Date.now()}-${videoFile.name}`);
    const uploadTask = uploadBytesResumable(videoFileRef, videoFile);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload failed: ", error);
        toast({ title: "Upload Failed", description: "Something went wrong. Please check storage rules and try again.", variant: 'destructive' });
        setIsUploading(false);
      },
      async () => {
        try {
          const videoUrl = await getDownloadURL(uploadTask.snapshot.ref);
          const thumbnailUrl = `https://picsum.photos/seed/${uploadTask.snapshot.ref.name}/600/400`;

          const newVideoDoc = await addDoc(collection(db, 'videos'), {
              title,
              description,
              tags,
              videoUrl,
              thumbnailUrl,
              uploaderId: user.id,
              createdAt: serverTimestamp(),
          });

          toast({ title: "Success!", description: "Your video has been uploaded." });
          router.push(`/video/${newVideoDoc.id}`);
        } catch (error) {
            console.error("Error saving video data:", error);
            toast({ title: "Error", description: "Failed to save video details.", variant: 'destructive' });
        } finally {
            setIsUploading(false);
        }
      }
    );
  };


  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="title" className="text-lg">Title</Label>
        <Input 
          id="title" 
          name="title" 
          placeholder="e.g., My Awesome Trip to the Mountains" 
          required 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isUploading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-lg">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="e.g., A video showcasing the beautiful landscapes and our adventures."
          className="min-h-[120px]"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isUploading}
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="tags-input" className="text-lg">Tags</Label>
        <div className="flex gap-2">
          <Input 
            id="tags-input" 
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Add a tag and press Enter"
            disabled={isUploading}
          />
          <Button type="button" onClick={addTag} disabled={isUploading}>Add Tag</Button>
        </div>
        <div className="p-4 border-2 border-dashed rounded-lg min-h-[80px] flex flex-wrap gap-2">
          {tags.length > 0 ? (
            tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-base py-1 pl-3 pr-1">
                {tag}
                <button
                  type="button"
                  onClick={() => !isUploading && removeTag(tag)}
                  className="ml-2 rounded-full hover:bg-muted-foreground/20 p-0.5 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  disabled={isUploading}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {tag}</span>
                </button>
              </Badge>
            ))
          ) : (
            <p className="text-sm text-muted-foreground self-center mx-auto">Added tags will appear here.</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="video-file" className="text-lg">Video File</Label>
        <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg  bg-card  ${videoFile ? 'border-primary' : ''} ${isUploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-accent/50'}`}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                    {videoFile ? (
                      <p className='font-semibold text-foreground'>{videoFile.name}</p>
                    ) : (
                      <>
                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-muted-foreground">MP4, MOV, or WEBM (MAX. 500MB)</p>
                      </>
                    )}
                </div>
                <input id="dropzone-file" type="file" className="hidden" accept="video/*" onChange={handleFileChange} disabled={isUploading} />
            </label>
        </div> 
      </div>

      {isUploading && (
        <div className="space-y-2">
            <Label className="text-lg">Upload Progress</Label>
            <Progress value={uploadProgress} className="w-full" />
            <p className='text-sm text-muted-foreground text-center'>{Math.round(uploadProgress)}% complete</p>
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isUploading}>
          <UploadCloud className="mr-2 h-5 w-5" />
          {isUploading ? `Uploading... ${Math.round(uploadProgress)}%` : 'Upload Video'}
        </Button>
      </div>
    </form>
  );
}
