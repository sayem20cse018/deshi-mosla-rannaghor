import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://deshi-moslar-rannaghar.vercel.app';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/account/', '/checkout/', '/admin/', '/api/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
