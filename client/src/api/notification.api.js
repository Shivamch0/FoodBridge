import api from './axios.js';

const listNotifications = async (params = {}) => {
  const res = await api.get('/notifications', { params });
  return res.data;
};

const markNotificationRead = async (id) => {
  const res = await api.patch(`/notifications/${id}/read`);
  return res.data;
};

export { listNotifications, markNotificationRead };
