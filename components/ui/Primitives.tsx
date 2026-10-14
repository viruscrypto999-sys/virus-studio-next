'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/components/providers/AppProviders';

/* ============================================================================
 * 1. BUTTON (with optional 60fps text-roll transform micro-interaction)
 * ========================================================================== */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  rollText?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      rollText = false,
      className,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const { playTick } = useAppStore();

    const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
      primary:
        'bg-text text-bg border border-transparent hover:opacity-90 font-medium',
      secondary:
        'bg-raised text-text border border-hairline hover:border-accent/40',
      outline:
        'bg-transparent text-text border border-hairline hover:border-accent/50 hover:bg-raised/40',
      ghost:
        'bg-transparent text-muted hover:text-text border border-transparent hover:bg-raised/40',
    };

    const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
      sm: 'px-3 py-1.5 text-xs rounded-r10',
      md: 'px-4 py-2.5 text-xs sm:text-sm rounded-r10',
      lg: 'px-6 py-3.5 text-sm rounded-r16',
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      playTick(1500);
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        className={cn(
          'inline-flex items-center justify-center gap-2 transition-transform duration-micro ease-expo-out active:scale-[0.98] disabled:opacity-45 disabled:pointer-events-none select-none',
          variantStyles[variant],
          sizeStyles[size],
          rollText && 'btn-roll',
          className
        )}
        {...props}
      >
        {rollText && typeof children === 'string' ? (
          <>
            <span className="btn-roll-inner">{children}</span>
            <span aria-hidden="true" className="btn-roll-clone">
              {children}
            </span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';

/* ============================================================================
 * 2. CARD (3D Specular Tilt on Desktop Fine-Pointer Only, Zero React Re-render)
 * ========================================================================== */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactiveTilt?: boolean;
  cursorActionLabel?: string;
  radius?: 'r16' | 'r24' | 'r36';
}

export function Card({
  interactiveTilt = false,
  cursorActionLabel,
  radius = 'r24',
  className,
  children,
  onMouseEnter,
  onMouseLeave,
  ...props
}: CardProps) {
  const { setCursorLabel } = useAppStore();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const glareRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number>(0);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactiveTilt || e.pointerType !== 'mouse') return;
    const el = cardRef.current;
    if (!el) return;

    window.cancelAnimationFrame(rafRef.current);
    const clientX = e.clientX;
    const clientY = e.clientY;

    rafRef.current = window.requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const x = (clientX - rect.left) / Math.max(1, rect.width);
      const y = (clientY - rect.top) / Math.max(1, rect.height);
      const rotateY = (x - 0.5) * 4.5; // Subtle architectural tilt max 2.25deg
      const rotateX = (0.5 - y) * 4.5;

      el.style.transform = `perspective(1100px) rotateX(${rotateX.toFixed(
        2
      )}deg) rotateY(${rotateY.toFixed(2)}deg) translate3d(0, -2px, 0)`;

      if (glareRef.current) {
        glareRef.current.style.opacity = '1';
        glareRef.current.style.transform = `translate3d(${(
          (x - 0.5) *
          40
        ).toFixed(1)}%, ${((y - 0.5) * 40).toFixed(1)}%, 0)`;
      }
    });
  };

  const handlePointerLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cursorActionLabel) setCursorLabel(null);
    onMouseLeave?.(e);
    if (!interactiveTilt) return;
    window.cancelAnimationFrame(rafRef.current);
    if (cardRef.current) {
      cardRef.current.style.transform =
        'perspective(1100px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)';
    }
    if (glareRef.current) {
      glareRef.current.style.opacity = '0';
    }
  };

  const handlePointerEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cursorActionLabel) setCursorLabel(cursorActionLabel);
    onMouseEnter?.(e);
  };

  useEffect(() => {
    return () => window.cancelAnimationFrame(rafRef.current);
  }, []);

  const radiusClass =
    radius === 'r16'
      ? 'rounded-r16'
      : radius === 'r36'
      ? 'rounded-r36'
      : 'rounded-r24';

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onMouseEnter={handlePointerEnter}
      onMouseLeave={handlePointerLeave}
      className={cn('spatial-card overflow-hidden', radiusClass, className)}
      {...props}
    >
      {interactiveTilt && (
        <div
          ref={glareRef}
          aria-hidden="true"
          className="pointer-events-none absolute -inset-1/2 z-0 opacity-0 transition-opacity duration-ui"
          style={{
            background:
              'radial-gradient(circle at center, var(--accent-ice-soft) 0%, transparent 55%)',
          }}
        />
      )}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

/* ============================================================================
 * 3. BADGE
 * ========================================================================== */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: 'default' | 'accent' | 'outline';
}

export function Badge({
  tone = 'default',
  className,
  children,
  ...props
}: BadgeProps) {
  const tones = {
    default: 'bg-raised text-muted border-hairline',
    accent: 'bg-accent/10 text-accent border-accent/35',
    outline: 'bg-transparent text-muted border-hairline',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-r10 border px-2.5 py-0.5 font-mono text-[11px] tracking-wide',
        tones[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

/* ============================================================================
 * 4. TABS (Hardware-accelerated active indicator)
 * ========================================================================== */
export interface TabOption<T extends string> {
  value: T;
  label: string;
  count?: number;
}

interface TabsProps<T extends string> {
  options: TabOption<T>[];
  value: T;
  onChange: (next: T) => void;
  ariaLabel: string;
  className?: string;
}

export function Tabs<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: TabsProps<T>) {
  const { playTick } = useAppStore();

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        'inline-flex flex-wrap items-center gap-1 rounded-r16 border border-hairline bg-surface p-1',
        className
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => {
              playTick(1580);
              onChange(opt.value);
            }}
            className={cn(
              'flex items-center gap-1.5 rounded-r10 px-3 py-1.5 text-xs font-medium transition-colors duration-micro',
              active
                ? 'bg-raised text-text border border-hairline'
                : 'text-muted hover:text-text border border-transparent'
            )}
          >
            <span>{opt.label}</span>
            {typeof opt.count === 'number' && (
              <span
                className={cn(
                  'font-mono text-[10px] tabular-nums',
                  active ? 'text-accent' : 'text-muted'
                )}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ============================================================================
 * 5. TOGGLE SWITCH
 * ========================================================================== */
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  const { playTick } = useAppStore();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => {
        playTick(checked ? 1280 : 1680);
        onChange(!checked);
      }}
      className="inline-flex items-center gap-2.5 text-xs text-muted hover:text-text focus:outline-none"
    >
      <span
        className={cn(
          'relative inline-flex h-5 w-9 items-center rounded-full border transition-colors duration-micro',
          checked
            ? 'border-accent/50 bg-accent/20'
            : 'border-hairline bg-raised'
        )}
      >
        <span
          className={cn(
            'inline-block h-3.5 w-3.5 rounded-full transition-transform duration-micro ease-expo-out',
            checked
              ? 'translate-x-4 bg-accent'
              : 'translate-x-0.5 bg-muted'
          )}
        />
      </span>
      <span>{label}</span>
    </button>
  );
}

/* ============================================================================
 * 6. MODAL & SHEET
 * ========================================================================== */
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidthClass?: string;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidthClass = 'max-w-3xl',
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 transition-opacity duration-micro"
      />
      <div
        className={cn(
          'relative z-10 w-full spatial-glass rounded-r24 overflow-hidden shadow-2xl transition-transform duration-ui ease-expo-out',
          maxWidthClass
        )}
      >
        <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
          <h3 className="text-sm font-mono uppercase tracking-widest text-text">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-r10 border border-hairline bg-raised px-2.5 py-1 font-mono text-xs text-muted hover:text-text"
          >
            [ESC]
          </button>
        </div>
        <div className="max-h-[80vh] overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}

export function Sheet({
  open,
  onClose,
  title,
  children,
}: Omit<ModalProps, 'maxWidthClass'>) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex justify-end"
    >
      <div onClick={onClose} className="fixed inset-0 bg-black/65" />
      <div className="relative z-10 h-full w-full max-w-md border-l border-hairline bg-surface p-6 overflow-y-auto">
        <div className="flex items-center justify-between border-b border-hairline pb-4">
          <h3 className="font-mono text-xs uppercase tracking-widest text-text">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="font-mono text-xs text-muted hover:text-text"
          >
            [CLOSE]
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

/* ============================================================================
 * 7. TOOLTIP & SKELETON SHIMMER (Transform-only shimmer)
 * ========================================================================== */
export function Tooltip({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [show, setShow] = useState(false);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      <span
        role="tooltip"
        className={cn(
          'pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded-r10 border border-hairline bg-raised px-2.5 py-1 font-mono text-[10px] text-text transition-all duration-micro ease-expo-out z-30',
          show
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-1'
        )}
      >
        {label}
      </span>
    </span>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative overflow-hidden rounded-r16 bg-raised/70 border border-hairline',
        className
      )}
    />
  );
}
