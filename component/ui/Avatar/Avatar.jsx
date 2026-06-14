'use client';
import React, { useState, useEffect } from 'react';

export const Avatar = ({ children, className = '' }) => (
  <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}>
    {children}
  </div>
);

export const AvatarImage = ({ src, alt, className = '' }) => {
  const [hasError, setHasError] = useState(false);
  const imgRef = React.useRef(null);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      if (imgRef.current.naturalWidth === 0) {
        setHasError(true);
      }
    }
  }, [src, hasError]);

  if (!src || src === 'null' || src === 'undefined' || hasError) return null;

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={`absolute inset-0 aspect-square h-full w-full object-cover ${className}`}
    />
  );
};

export const AvatarFallback = ({ children, className = '' }) => (
  <div className={`flex h-full w-full items-center justify-center rounded-full bg-slate-200 ${className}`}>
    {children}
  </div>
);
