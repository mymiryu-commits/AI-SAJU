'use client';

interface VersionBadgeProps {
  variant?: 'default' | 'hero';
  className?: string;
}

export function VersionBadge({ variant = 'default', className = '' }: VersionBadgeProps) {
  const commitHash = process.env.NEXT_PUBLIC_COMMIT_HASH || 'dev';
  const commitDate = process.env.NEXT_PUBLIC_COMMIT_DATE || '';

  const version = commitDate ? `v${commitDate}-${commitHash}` : `v${commitHash}`;

  if (variant === 'hero') {
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs text-muted-foreground/70 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        {version}
      </span>
    );
  }

  return (
    <span className={`text-xs text-muted-foreground/60 ${className}`}>
      {version}
    </span>
  );
}
