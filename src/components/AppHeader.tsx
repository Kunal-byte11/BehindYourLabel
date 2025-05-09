
'use client';

import React, { useEffect, useState } from 'react'; 
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import BylLogoIcon from '@/components/icons/BylLogoIcon';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ScanLine, History, LogIn, LogOut, UserCircle } from 'lucide-react'; 
import { createClient } from '@/lib/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AppHeader = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      setLoading(false);
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (_event === 'SIGNED_OUT') {
        router.push('/'); // Redirect to home on sign out
      }
      if(_event === 'SIGNED_IN'){
        router.refresh(); // Refresh page to update server components if any
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  };

  const navItems = [
    { href: '/', label: 'Scan', icon: <ScanLine className="h-5 w-5" /> },
    { href: '/history', label: 'History', icon: <History className="h-5 w-5" /> },
  ];

  const getInitials = (email?: string) => {
    if (!email) return 'U';
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <BylLogoIcon className="h-8 w-12 text-primary" />
          <span className="font-bold text-xl sm:inline-block text-foreground">Beyond Your Label</span>
        </Link>
        
        <nav className="hidden flex-1 items-center space-x-1 md:flex">
          {navItems.map((item) => (
            <Button key={item.label} variant="ghost" asChild className="text-sm font-medium text-muted-foreground hover:text-primary">
              <Link href={item.href} className="flex items-center gap-2">
                {React.cloneElement(item.icon, { className: "h-5 w-5 text-current" })}
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
          {loading ? (
            <div className="h-8 w-20 animate-pulse rounded-md bg-muted"></div>
          ) : user ? (
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || 'User'} />
                    <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name || user.email}</p>
                    {user.user_metadata?.full_name && <p className="text-xs leading-none text-muted-foreground">{user.email}</p>}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" asChild className="text-sm font-medium text-muted-foreground hover:text-primary">
              <Link href="/login" className="flex items-center gap-2">
                <LogIn className="h-5 w-5" />
                Login
              </Link>
            </Button>
          )}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[260px] p-4 bg-background">
                <div className="flex flex-col space-y-2">
                  <Link href="/" className="mb-4 flex items-center space-x-2 p-2">
                    <BylLogoIcon className="h-8 w-12 text-primary" />
                    <span className="font-bold text-lg text-foreground">Beyond Your Label</span>
                  </Link>
                  {navItems.map((item) => (
                    <Button 
                      key={item.label} 
                      variant="ghost" 
                      className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-muted" 
                      asChild
                    >
                       <Link href={item.href} className="flex items-center gap-3 p-3 text-base">
                        {React.cloneElement(item.icon, { className: "h-5 w-5 text-current" })}
                        {item.label}
                      </Link>
                    </Button>
                  ))}
                   <div className="border-t pt-2 mt-2">
                    {loading ? null : user ? (
                       <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-muted flex items-center gap-3 p-3 text-base">
                         <LogOut className="h-5 w-5" /> Log Out
                       </Button>
                    ) : (
                       <Button variant="ghost" asChild className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-muted">
                         <Link href="/login" className="flex items-center gap-3 p-3 text-base">
                           <LogIn className="h-5 w-5" /> Login
                         </Link>
                       </Button>
                    )}
                   </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
