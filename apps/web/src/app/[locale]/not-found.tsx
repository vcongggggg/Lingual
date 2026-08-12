'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Button, Card } from '@linguaflow/ui';
import { Home, ArrowLeft } from 'lucide-react';
import { mascotReactions } from '@linguaflow/config';

export default function NotFoundPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card glow="coral" className="max-w-md w-full text-center space-y-6 p-8">
        <div className="relative w-36 h-36 mx-auto animate-bounce">
          <Image
            src={mascotReactions.wrong_mild}
            alt="Mascot 404 Lost Cow"
            width={144}
            height={144}
            className="w-full h-full object-contain drop-shadow-[0_8px_20px_rgba(244,63,94,0.3)]"
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-display font-extrabold text-white">404 — Bò đi lạc rồi... 🥺</h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển sang lối đi khác.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link href={`/${locale}/dashboard`} className="flex-1">
            <Button variant="accent" size="lg" className="w-full" icon={<Home className="w-4 h-4" />}>
              Về Trang Chủ
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
