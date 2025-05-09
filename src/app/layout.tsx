import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Using Inter as a more modern sans-serif font
import './globals.css';
import AppHeader from '@/components/AppHeader';
import { Providers } from '@/lib/providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Ingredient Insights',
  description: 'Scan product labels and understand ingredients with AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <AppHeader />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="py-6 md:px-8 md:py-0 border-t">
              <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
                <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
                  Built with Next.js and Genkit AI.
                </p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
