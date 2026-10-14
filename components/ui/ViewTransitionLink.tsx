'use client';

import React from 'react';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';

interface ViewTransitionLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  viewTransitionName?: string;
  onMouseEnter?: React.MouseEventHandler<HTMLAnchorElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLAnchorElement>;
}

export function ViewTransitionLink({
  href,
  children,
  className,
  viewTransitionName,
  onClick,
  ...props
}: ViewTransitionLinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (
      e.defaultPrevented ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0
    ) {
      return;
    }

    const docWithVT = document as Document & {
      startViewTransition?: (cb: () => void) => void;
    };

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (docWithVT.startViewTransition && !prefersReduced) {
      e.preventDefault();
      docWithVT.startViewTransition(() => {
        router.push(String(href));
      });
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={className}
      style={
        viewTransitionName
          ? ({ viewTransitionName } as React.CSSProperties)
          : undefined
      }
      {...props}
    >
      {children}
    </Link>
  );
}
