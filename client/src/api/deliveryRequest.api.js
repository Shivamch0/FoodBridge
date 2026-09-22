import api from './axios.js';

const listDeliveryRequests = async (params = {}) => {
  const res = await api.get('/delivery-requests', { params });
  return res.data;
};

const createDeliveryRequest = async (data) => {
  const res = await api.post('/delivery-requests', data);
  return res.data;
};

const acceptVolunteerRequest = async (id) => {
  const res = await api.post(`/delivery-requests/${id}/volunteer-accept`);
  return res.data;
};

const rejectVolunteerRequest = async (id) => {
  const res = await api.post(`/delivery-requests/${id}/volunteer-reject`);
  return res.data;
};

const expireDeliveryRequest = async (id) => {
  const res = await api.post(`/delivery-requests/${id}/expire`);
  return res.data;
};

export { listDeliveryRequests, createDeliveryRequest, acceptVolunteerRequest, rejectVolunteerRequest, expireDeliveryRequest };
