'use client';

import React, { useState, useEffect, useRef } from 'react';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  as?: React.ElementType;
}

/**
 * Component Scroll-Reveal dùng chung:
 * - Fade-in và trượt nhẹ lên (translateY: 20px -> 0) khi cuộn vào viewport
 * - Progressive Enhancement: SSR & No-JS hiển thị 100% nội dung (không bao giờ bị ẩn vĩnh viễn)
 * - Tự reveal ngay lập tức cho các phần tử above-the-fold
 * - Hỗ trợ stagger qua prop delayMs (60-90ms mỗi item)
 * - Tôn trọng prefers-reduced-motion
 * - Chỉ kích hoạt 1 lần duy nhất (không ẩn lại khi cuộn ngược lên)
 */
export function Reveal({
  children,
  className = '',
  delayMs = 0,
  as: Component = 'div',
}: RevealProps) {
  const domRef = useRef<HTMLElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // 1. Tôn trọng người dùng đặt chế độ giảm chuyển động
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const el = domRef.current;
    if (!el) {
      setIsVisible(true);
      return;
    }

    // 2. Kiểm tra nếu phần tử đã nằm trong viewport ngay khi mount (Above-the-fold)
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      if (delayMs > 0) {
        const timer = setTimeout(() => setIsVisible(true), Math.min(delayMs, 300));
        return () => clearTimeout(timer);
      }
      setIsVisible(true);
      return;
    }

    // 3. Sử dụng IntersectionObserver để theo dõi cuộn
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    let delayTimer: NodeJS.Timeout | null = null;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          if (delayMs > 0) {
            delayTimer = setTimeout(() => {
              setIsVisible(true);
            }, Math.min(delayMs, 300));
          } else {
            setIsVisible(true);
          }
          // Chỉ reveal 1 lần, ngắt quan sát ngay
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(el);

    return () => {
      if (delayTimer) clearTimeout(delayTimer);
      if (el) observer.unobserve(el);
    };
  }, [delayMs]);

  // Progressive enhancement: Nếu JS chưa chạy hoặc đang SSR, giữ nguyên class thuần
  const revealClass = !isMounted
    ? ''
    : isVisible
    ? 'scroll-reveal-visible'
    : 'scroll-reveal-init';

  return (
    <Component
      ref={domRef}
      className={`${revealClass} ${className}`.trim()}
    >
      {children}
    </Component>
  );
}
