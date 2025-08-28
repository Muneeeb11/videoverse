'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UploadCloud, X } from 'lucide-react';

export default function UploadForm() {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const addTag = () => {
    const newTag = tagInput.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  return (
    <form className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-lg">Title</Label>
        <Input id="title" name="title" placeholder="e.g., My Awesome Trip to the Mountains" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-lg">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="e.g., A video showcasing the beautiful landscapes and our adventures."
          className="min-h-[120px]"
          required
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
          />
          <Button type="button" onClick={addTag}>Add Tag</Button>
        </div>
        <div className="p-4 border-2 border-dashed rounded-lg min-h-[80px] flex flex-wrap gap-2">
          {tags.length > 0 ? (
            tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-base py-1 pl-3 pr-1">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 rounded-full hover:bg-muted-foreground/20 p-0.5"
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
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-accent/50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-muted-foreground">MP4, MOV, or WEBM (MAX. 500MB)</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" />
            </label>
        </div> 
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="lg">
          <UploadCloud className="mr-2 h-5 w-5" />
          Upload Video
        </Button>
      </div>
    </form>
  );
}