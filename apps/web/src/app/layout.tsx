import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pebble-implosion-art.ngrok-free.dev';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Lingual — Học tiếng Anh mỗi ngày, nhớ lâu thật sự',
  description: 'Nền tảng học tiếng Anh sổ tay giấy kết hợp ôn tập thông minh, 5 Kỹ Năng và luyện thi IELTS chuẩn hóa.',
  openGraph: {
    title: 'Lingual — Học tiếng Anh mỗi ngày, nhớ lâu thật sự',
    description: 'Nền tảng học tiếng Anh sổ tay giấy kết hợp ôn tập thông minh, 5 Kỹ Năng và luyện thi IELTS chuẩn hóa.',
    url: siteUrl,
    siteName: 'Lingual',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/mascot/cow_gen_heart.png',
        width: 1200,
        height: 630,
        alt: 'Lingual - Học tiếng Anh mỗi ngày cùng Linh Vật Bò Sữa',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lingual — Học tiếng Anh mỗi ngày, nhớ lâu thật sự',
    description: 'Nền tảng học tiếng Anh sổ tay giấy kết hợp ôn tập thông minh, 5 Kỹ Năng và luyện thi IELTS chuẩn hóa.',
    images: ['/mascot/cow_gen_heart.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=Playfair+Display:ital,wght@0,600;0,700;0,800;0,900;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col justify-between selection:bg-amber selection:text-ink w-full max-w-full overflow-x-clip">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
