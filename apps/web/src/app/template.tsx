'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div
      key={pathname}
      id="lingual-page-transition"
      data-pathname={pathname}
      className="animate-page-entry w-full flex-1 flex flex-col"
    >
      {children}
    </div>
  );
}
