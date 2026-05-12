import type { SVGProps } from 'react';

export type IconMotion = 'float' | 'bob' | 'sway' | 'pulse' | 'orbit' | 'spin' | 'none';

type Base = Omit<SVGProps<SVGSVGElement>, 'children'> & {
  motion?: IconMotion;
};

export function iconClass(motion?: IconMotion, className?: string) {
  const m = motion ?? 'none';
  const base = m !== 'none' ? `icon icon--${m}` : 'icon';
  return [base, className].filter(Boolean).join(' ');
}

const svgProps = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true as const,
};

export function IconClipboard({ motion, className, ...rest }: Base) {
  return (
    <svg
      className={iconClass(motion, className)}
      width={18}
      height={18}
      viewBox="0 0 24 24"
      {...svgProps}
      {...rest}
    >
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
      <path d="M9 12h6M9 16h6M13 8H9" />
    </svg>
  );
}

export function IconUser({ motion, className, ...rest }: Base) {
  return (
    <svg
      className={iconClass(motion, className)}
      width={18}
      height={18}
      viewBox="0 0 24 24"
      {...svgProps}
      {...rest}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function IconShield({ motion, className, ...rest }: Base) {
  return (
    <svg
      className={iconClass(motion, className)}
      width={18}
      height={18}
      viewBox="0 0 24 24"
      {...svgProps}
      {...rest}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function IconUsers({ motion, className, ...rest }: Base) {
  return (
    <svg
      className={iconClass(motion, className)}
      width={18}
      height={18}
      viewBox="0 0 24 24"
      {...svgProps}
      {...rest}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function IconLogout({ motion, className, ...rest }: Base) {
  return (
    <svg
      className={iconClass(motion, className)}
      width={18}
      height={18}
      viewBox="0 0 24 24"
      {...svgProps}
      {...rest}
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

export function IconPlus({ motion, className, ...rest }: Base) {
  return (
    <svg
      className={iconClass(motion, className)}
      width={18}
      height={18}
      viewBox="0 0 24 24"
      {...svgProps}
      {...rest}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}

export function IconPencil({ motion, className, ...rest }: Base) {
  return (
    <svg
      className={iconClass(motion, className)}
      width={17}
      height={17}
      viewBox="0 0 24 24"
      {...svgProps}
      {...rest}
    >
      <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

export function IconTrash({ motion, className, ...rest }: Base) {
  return (
    <svg
      className={iconClass(motion, className)}
      width={17}
      height={17}
      viewBox="0 0 24 24"
      {...svgProps}
      {...rest}
    >
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6Z" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export function IconCheck({ motion, className, ...rest }: Base) {
  return (
    <svg
      className={iconClass(motion, className)}
      width={17}
      height={17}
      viewBox="0 0 24 24"
      {...svgProps}
      {...rest}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function IconSparkles({ motion, className, ...rest }: Base) {
  return (
    <svg
      className={iconClass(motion, className)}
      width={26}
      height={26}
      viewBox="0 0 24 24"
      {...svgProps}
      {...rest}
    >
      <path d="m12 3 1.9 5.7 5.8.2-4.6 3.5 1.7 5.6L12 15.9 7.2 18l1.7-5.6L4.3 9l5.8-.2z" />
      <path d="M5 3v4M3 5h4M19 17v2M18 18h2" />
    </svg>
  );
}

export function IconInbox({ motion, className, ...rest }: Base) {
  return (
    <svg
      className={iconClass(motion, className)}
      width={48}
      height={48}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...rest}
    >
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-7A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1z" />
    </svg>
  );
}
