import Link from 'next/link';
import LogoIcon from '@/components/icons/LogoIcon';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ScanLine, History } from 'lucide-react';

const AppHeader = () => {
  const navItems = [
    { href: '/', label: 'Scan', icon: <ScanLine className="h-5 w-5" /> },
    { href: '/history', label: 'History', icon: <History className="h-5 w-5" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <LogoIcon className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl sm:inline-block">Ingredient Insights</span>
        </Link>
        
        <nav className="hidden flex-1 items-center space-x-4 md:flex">
          {navItems.map((item) => (
            <Button key={item.label} variant="ghost" asChild>
              <Link href={item.href} className="flex items-center gap-2 text-foreground/80 hover:text-foreground">
                {item.icon}
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-4 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] p-4">
              <div className="flex flex-col space-y-4">
                <Link href="/" className="mb-4 flex items-center space-x-2">
                  <LogoIcon className="h-8 w-8 text-primary" />
                  <span className="font-bold text-lg">Ingredient Insights</span>
                </Link>
                {navItems.map((item) => (
                  <Button key={item.label} variant="ghost" className="w-full justify-start" asChild>
                     <Link href={item.href} className="flex items-center gap-2">
                      {item.icon}
                      {item.label}
                    </Link>
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
