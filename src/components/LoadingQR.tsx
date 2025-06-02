import React from 'react';
import Image from 'next/image';

interface LoadingQRProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingQR: React.FC<LoadingQRProps> = ({
  text = 'Loading...',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const dimensions = {
    sm: 40,
    md: 64,
    lg: 96,
  };

  const dotClasses = {
    sm: 'w-1 h-1',
    md: 'w-1.5 h-1.5',
    lg: 'w-2 h-2'
  };

  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="relative flex items-center justify-center">
        <Image
          src="/qr-loading.webp"
          alt="Loading QR Code"
          width={dimensions[size]}
          height={dimensions[size]}
          className={`${sizeClasses[size]} object-contain`}
          priority
        />
      </div>
      {text && (
        <div className="flex items-center mt-3 gap-1">
          <span className={`${textSizeClasses[size]} text-gray-500 font-light tracking-wide`}>
            {text.replace('...', '')}
          </span>
          <span className="flex items-center gap-[3px]">
            <span className={`${dotClasses[size]} rounded-full bg-gray-400 animate-bounce`} style={{ animationDelay: '0ms' }}></span>
            <span className={`${dotClasses[size]} rounded-full bg-gray-400 animate-bounce`} style={{ animationDelay: '150ms' }}></span>
            <span className={`${dotClasses[size]} rounded-full bg-gray-400 animate-bounce`} style={{ animationDelay: '300ms' }}></span>
          </span>
        </div>
      )}
    </div>
  );
};

export default LoadingQR; 