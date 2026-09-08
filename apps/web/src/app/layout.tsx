import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#070b14',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'LinguaFlow — Học Tiếng Anh & Luyện Thi IELTS Chuẩn Quốc Tế',
  description: 'Nền tảng học tiếng Anh & luyện thi IELTS thông minh với 26,500+ từ vựng chuẩn CEFR, lặp lại ngắt quãng SRS SM-2, và giao diện Cyber-Academic Luminescence.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'LinguaFlow',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-body antialiased">
        {children}
      </body>
    </html>
  );
}
