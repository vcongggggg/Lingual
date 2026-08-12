import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LinguaFlow - Học Tiếng Anh Gamified Cho Người Việt',
  description: 'Nền tảng học tiếng Anh theo lộ trình gamified, lặp lại ngắt quãng SRS SM-2, Game Center và AI Explainer.',
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
