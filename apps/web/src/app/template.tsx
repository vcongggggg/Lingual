'use client';

import React from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-page-entry w-full flex-1 flex flex-col">
      {children}
    </div>
  );
}
