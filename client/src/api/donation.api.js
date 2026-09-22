import api from './axios.js';

const createDonation = async (data) => {
  const res = await api.post('/donations', data);
  return res.data;
};

const listDonations = async (params = {}) => {
  const res = await api.get('/donations', { params });
  return res.data;
};

const getDonation = async (id) => {
  const res = await api.get(`/donations/${id}`);
  return res.data;
};

const updateDonation = async (id, data) => {
  const res = await api.patch(`/donations/${id}`, data);
  return res.data;
};

const cancelDonation = async (id) => {
  const res = await api.post(`/donations/${id}/cancel`);
  return res.data;
};

export { createDonation, listDonations, getDonation, updateDonation, cancelDonation };
