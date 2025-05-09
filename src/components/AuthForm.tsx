'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient as createSupabaseClient } from '@/lib/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, LogIn, UserPlus, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // For signup
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // To toggle between Sign In and Sign Up

  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setSupabase(createSupabaseClient());
  }, []);

  const handleAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!supabase) {
      setError('Supabase client is not initialized. Please try again shortly.');
      setLoading(false);
      return;
    }

    if (isSignUp) {
      // Sign Up
      if (!name.trim()) {
        setError('Name is required for sign up.');
        setLoading(false);
        return;
      }
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: `${window.location.origin}/`, // Redirect after email confirmation
        },
      });
      if (signUpError) {
        setError(signUpError.message);
      } else {
        toast({
          title: "Sign Up Successful!",
          description: "Please check your email to confirm your account.",
        });
        router.refresh(); 
        setEmail('');
        setPassword('');
        setName('');
      }
    } else {
      // Sign In
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError(signInError.message);
      } else {
        toast({
          title: "Sign In Successful!",
          description: "Welcome back!",
        });
        router.push('/'); 
        router.refresh(); 
      }
    }
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <Tabs defaultValue="signin" onValueChange={(value) => setIsSignUp(value === "signup")} className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-primary">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            {isSignUp ? 'Enter your details to create an account.' : 'Enter your credentials to access your account.'}
          </CardDescription>
          <TabsList className="grid w-full grid-cols-2 mt-4">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
        </CardHeader>
        <form onSubmit={handleAuth}>
          <TabsContent value="signin">
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-signin">Email</Label>
                <Input
                  id="email-signin"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading || !supabase}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-signin">Password</Label>
                <Input
                  id="password-signin"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading || !supabase}
                />
              </div>
            </CardContent>
          </TabsContent>
          <TabsContent value="signup">
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name-signup">Full Name</Label>
                <Input
                  id="name-signup"
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading || !supabase}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-signup">Email</Label>
                <Input
                  id="email-signup"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading || !supabase}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-signup">Password</Label>
                <Input
                  id="password-signup"
                  type="password"
                  placeholder="Choose a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={loading || !supabase}
                />
                 <p className="text-xs text-muted-foreground">Password must be at least 6 characters.</p>
              </div>
            </CardContent>
          </TabsContent>
          
          {error && (
            <div className="px-6 pb-2">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Authentication Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}

          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading || !supabase}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : isSignUp ? (
                <UserPlus className="mr-2 h-4 w-4" />
              ) : (
                <LogIn className="mr-2 h-4 w-4" />
              )}
              {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </Button>
            {!supabase && !loading && (
              <p className="text-xs text-muted-foreground mt-2">Initializing authentication...</p>
            )}
          </CardFooter>
        </form>
      </Tabs>
    </Card>
  );
}
