import api from './axios.js';

const authRequestConfig = { skipAuthRefresh: true };

const registerUser = async (data) => {
  const res = await api.post('/auth/register', data, authRequestConfig);
  return res.data;
};

const loginUser = async (data) => {
  const res = await api.post('/auth/login', data, authRequestConfig);
  return res.data;
};

const logoutUser = async () => {
  const res = await api.post('/auth/logout');
  return res.data;
};

const refreshToken = async () => {
  const res = await api.post('/auth/refresh', {}, authRequestConfig);
  return res.data;
};

const getCurrentUser = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};

const updateCurrentUser = async (data) => {
  const res = await api.patch('/auth/me', data);
  return res.data;
};

export { registerUser, loginUser, logoutUser, refreshToken, getCurrentUser, updateCurrentUser };
