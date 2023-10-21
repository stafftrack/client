import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Sidebar from '@/components/Sidebar';
import Providers from './providers';
import { getDictionary } from './dictionaries';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'stafftrack',
  description: 'track your staff',
};

export default async function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: any;
}) {
  const dict = await getDictionary(lang);
  return (
    <html lang={lang} className="bg-primary">
      <body className={inter.className}>
        <Providers>
          <div className="flex h-screen font-sans">
            <Sidebar dict={dict} lang={lang} />
            <div className="h-screen w-full overflow-y-scroll">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
