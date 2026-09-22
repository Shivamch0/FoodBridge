import api from './axios.js';

const listDeliveries = async (params = {}) => {
  const res = await api.get('/deliveries', { params });
  return res.data;
};

const updateDeliveryStatus = async (id, data) => {
  const res = await api.patch(`/deliveries/${id}/status`, data);
  return res.data;
};

export { listDeliveries, updateDeliveryStatus };
