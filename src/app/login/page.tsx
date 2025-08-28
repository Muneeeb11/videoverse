import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen-minus-header py-12">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Add a simple style to tailwind config if needed, or inline for layout
// In tailwind.config.ts > theme > extend:
// minHeight: { 'screen-minus-header': 'calc(100vh - 3.5rem)' } // 3.5rem is h-14
// For this case, let's use a class that does the same thing in page.tsx as it's a one-off.
// A better way for a real app would be a layout component that wraps pages needing this style.
// Let's use CSS directly in the component for simplicity.
const styles = `
.min-h-screen-minus-header {
  min-height: calc(100vh - 3.5rem);
}
`;
// And add a style tag to the component (not best practice, but fine for this)
// Or just apply the style via a layout wrapper, which we've done by putting it on the div.
