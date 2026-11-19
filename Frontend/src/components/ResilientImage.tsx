import {useState} from 'react';
import {AppIcon} from './AppIcon';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackIcon?: string;
  fallbackTitle?: string;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackIcon = 'local_hospital',
  fallbackTitle = 'رعاية طبية معتمدة',
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-primary-fixed/60 via-surface-container to-secondary-fixed/50 text-primary p-4 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <AppIcon name={fallbackIcon} size={36} className="text-secondary mb-1" />
        <span className="font-label-md text-label-md text-primary/80">{fallbackTitle}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
