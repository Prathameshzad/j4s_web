import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

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

export default axiosClient;
