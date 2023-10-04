import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Sidebar from '@/components/Sidebar';
import Providers from './providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'stafftrack',
  description: 'track your staff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" className="bg-primary">
      <body className={inter.className}>
        <Providers>
          <div className="h-scren flex font-sans">
            <Sidebar />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
