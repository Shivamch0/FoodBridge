const request = (operation) =>
  operation
    .then(({ data }) => data)
    .catch((error) => {
      throw new Error(error.response?.data?.message || 'Something went wrong');
    });

export * from './index.js';
export { request };
