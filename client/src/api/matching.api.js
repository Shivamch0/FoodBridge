import api from './axios.js';

const getNearbyOrganizations = async (donationId) => {
  const res = await api.get(`/matching/donations/${donationId}/organizations`);
  return res.data;
};

export { getNearbyOrganizations };
