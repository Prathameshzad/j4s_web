/**
 * Constructs a full URL for media files served by the backend.
 * Handles different environments (local dev vs production).
 */
export const getMediaUrl = (url) => {
  if (!url) return '#';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;

  const baseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';
  const cleanPath = url.startsWith('/') ? url.slice(1) : url;
  
  return `${baseUrl}/${cleanPath}`;
};
