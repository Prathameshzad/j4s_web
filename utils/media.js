/**
 * Constructs a full URL for media files served by the backend.
 * Handles different environments (local dev vs production).
 */
export const getMediaUrl = (url) => {
  if (!url) return '#';
  if (url.startsWith('http')) return url;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/web';
  
  // Remove /api/web or /api/institute if present to get the base backend URL
  const baseUrl = apiUrl.replace(/\/api(\/web|\/institute)?$/, '');
  
  // Ensure the relative URL starts with a slash
  const relativeUrl = url.startsWith('/') ? url : `/${url}`;
  
  return `${baseUrl}${relativeUrl}`;
};
