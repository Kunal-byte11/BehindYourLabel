
import React from 'react'; 
import Link from 'next/link';
import BylLogoIcon from '@/components/icons/BylLogoIcon'; // Updated import
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ScanLine, History } from 'lucide-react'; 

const AppHeader = () => {
  const navItems = [
    { href: '/', label: 'Scan', icon: <ScanLine className="h-5 w-5" /> },
    { href: '/history', label: 'History', icon: <History className="h-5 w-5" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <BylLogoIcon className="h-8 w-12 text-primary" /> {/* Updated to BylLogoIcon and adjusted width */}
          <span className="font-bold text-xl sm:inline-block text-foreground">Ingredient Insights</span>
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

        <div className="flex flex-1 items-center justify-end space-x-2 md:hidden">
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
                  <BylLogoIcon className="h-8 w-12 text-primary" /> {/* Updated to BylLogoIcon and adjusted width */}
                  <span className="font-bold text-lg text-foreground">Ingredient Insights</span>
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
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
