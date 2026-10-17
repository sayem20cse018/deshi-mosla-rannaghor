import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: {
    default: 'দেশি মসলার রান্নাঘর | Deshi Moslar Rannaghar',
    template: '%s | দেশি মসলার রান্নাঘর',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://deshi-moslar-rannaghar.vercel.app'),
  description:
    'বাংলাদেশের সেরা অনলাইন মসলা ও গ্রোসারি শপ। দেশীয় মসলা, চাল, ডাল, তেল এবং রান্নার প্রয়োজনীয় পণ্য ঘরে বসে অর্ডার করুন।',
  keywords: ['মসলা', 'গ্রোসারি', 'অনলাইন শপ', 'বাংলাদেশ', 'spices', 'grocery', 'deshi moslar'],
  authors: [{ name: 'Deshi Moslar Rannaghar' }],
  openGraph: {
    type: 'website',
    locale: 'bn_BD',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'দেশি মসলার রান্নাঘর',
    images: [{ url: '/og-image.svg', width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.svg', apple: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="min-h-screen bg-background antialiased">
        <Providers>
          {children}
          <Toaster
            position="top-center"
            gutter={8}
            toastOptions={{
              duration: 3000,
              style: {
                background: '#0f4c2a',
                color: '#fff',
                fontFamily: 'Manrope, Noto Sans Bengali, sans-serif',
                fontSize: '14px',
                fontWeight: '600',
                borderRadius: '14px',
                padding: '12px 18px',
                boxShadow: '0 8px 32px rgba(15,76,42,0.25), 0 2px 8px rgba(0,0,0,0.12)',
                maxWidth: '380px',
              },
              success: {
                style: {
                  background: '#0f4c2a',
                  color: '#fff',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: '#0f4c2a',
                },
              },
              error: {
                style: {
                  background: '#dc2626',
                  color: '#fff',
                  boxShadow: '0 8px 32px rgba(220,38,38,0.25), 0 2px 8px rgba(0,0,0,0.12)',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: '#dc2626',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
