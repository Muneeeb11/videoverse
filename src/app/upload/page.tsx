import UploadForm from "@/components/upload-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function UploadPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Card className="border-border/40">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl lg:text-4xl font-extrabold tracking-tight">Upload Your Video</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">Fill out the details and share your masterpiece.</CardDescription>
        </CardHeader>
        <CardContent>
          <UploadForm />
        </CardContent>
      </Card>
    </div>
  );
}
