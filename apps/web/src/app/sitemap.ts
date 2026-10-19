import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pebble-implosion-art.ngrok-free.dev';

  const publicRoutes = [
    '',
    '/login',
    '/register',
    '/ielts',
    '/dictionary',
    '/games',
    '/practice',
    '/daily',
    '/letters',
    '/listening',
    '/tutor',
    '/srs',
    '/vocabulary',
    '/analytics',
    '/profile',
    '/community',
    '/curriculum',
    '/roadmap',
    '/reading',
    '/speaking',
    '/writing',
    '/story',
    '/eavesdrop',
    '/exam-practice',
    '/achievements',
  ];

  const now = new Date();

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/login' || route === '/register' ? 0.6 : 0.8,
  }));
}
