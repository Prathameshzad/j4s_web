import axios from 'axios';
import toast from 'react-hot-toast';

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Request interceptor — attach auth headers
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const selectedProfile = localStorage.getItem('selectedProfile');
  const selectedChild = localStorage.getItem('selectedChild');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (selectedProfile) {
    const profile = JSON.parse(selectedProfile);
    config.headers['x-selected-role'] = profile.role;

    if (profile.role === 'PARENT' && selectedChild) {
      const child = JSON.parse(selectedChild);
      config.headers['x-selected-user-id'] = child.id;
    } else {
      config.headers['x-selected-user-id'] = profile.userId || '';
    }
  }

  return config;
});

// ─── Rate Limit (429) countdown toast ────────────────────────────────────────
let rateLimitToastId = null;
let rateLimitCountdownInterval = null;

const showRateLimitToast = (retryAfterSeconds) => {
  // Clear any existing countdown
  if (rateLimitCountdownInterval) clearInterval(rateLimitCountdownInterval);
  if (rateLimitToastId) toast.dismiss(rateLimitToastId);

  let remaining = retryAfterSeconds || 60;

  const renderToast = (t, secs) => (
    `Too many requests — please wait ${secs}s before trying again.`
  );

  rateLimitToastId = toast.error(renderToast(null, remaining), {
    duration: (remaining + 2) * 1000,
    style: {
      background: '#1a1a2e',
      color: '#fff',
      border: '1px solid #f97316',
      borderRadius: '12px',
      fontSize: '14px',
      maxWidth: '380px',
      padding: '14px 18px',
    },
    iconTheme: { primary: '#f97316', secondary: '#fff' },
    id: 'rate-limit-toast',
  });

  rateLimitCountdownInterval = setInterval(() => {
    remaining -= 1;
    if (remaining <= 0) {
      clearInterval(rateLimitCountdownInterval);
      rateLimitCountdownInterval = null;
      toast.dismiss('rate-limit-toast');
      toast.success('You can try again now!', {
        style: {
          background: '#1a1a2e',
          color: '#fff',
          border: '1px solid #22c55e',
          borderRadius: '12px',
        },
        id: 'rate-limit-ok-toast',
      });
    } else {
      toast.error(renderToast(null, remaining), {
        id: 'rate-limit-toast',
        duration: (remaining + 2) * 1000,
        style: {
          background: '#1a1a2e',
          color: '#fff',
          border: '1px solid #f97316',
          borderRadius: '12px',
          fontSize: '14px',
          maxWidth: '380px',
          padding: '14px 18px',
        },
        iconTheme: { primary: '#f97316', secondary: '#fff' },
      });
    }
  }, 1000);
};

// Response interceptor — handle 429 globally
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      // Read retry-after from header (seconds) or default to 60s
      const retryAfter = parseInt(
        error.response.headers['retry-after'] ||
        error.response.headers['ratelimit-reset'] ||
        '60',
        10
      );
      showRateLimitToast(retryAfter);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
