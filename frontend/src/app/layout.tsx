import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: {
    default: 'দেশি মসলার রান্নাঘর | Deshi Moslar Rannaghar',
    template: '%s | দেশি মসলার রান্নাঘর',
  },
  description:
    'বাংলাদেশের সেরা অনলাইন মসলা ও গ্রোসারি শপ। দেশীয় মসলা, চাল, ডাল, তেল এবং রান্নার প্রয়োজনীয় পণ্য ঘরে বসে অর্ডার করুন।',
  keywords: ['মসলা', 'গ্রোসারি', 'অনলাইন শপ', 'বাংলাদেশ', 'spices', 'grocery', 'deshi moslar'],
  authors: [{ name: 'Deshi Moslar Rannaghar' }],
  openGraph: {
    type: 'website',
    locale: 'bn_BD',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'দেশি মসলার রান্নাঘর',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="min-h-screen bg-background font-bengali antialiased">
        <Providers>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#166534',
                color: '#fff',
                fontFamily: 'Hind Siliguri, sans-serif',
              },
              success: { style: { background: '#166534' } },
              error: { style: { background: '#dc2626' } },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
