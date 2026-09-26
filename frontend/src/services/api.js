import axios from 'axios';

// Axios instance එකක් හදනවා
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// හැම request එකකට කලින්, localStorage එකේ token එක තියෙනවා නම්,
// ඒක automatically header එකට add කරනවා
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;