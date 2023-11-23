const localUrlBase = 'http://localhost:3000';
const hostedUrlBase = 'https://nest.comp4537.com';

// Function to create a full URL by appending the endpoint to the base URL
const createUrl = (base, endpoint) => `${base}${endpoint}`;

// User-related URLs
const userUrls = {
  getUsersUrl: createUrl(localUrlBase, '/users/getUsers'),
  deleteUserUrl: createUrl(localUrlBase, '/users/delete'),
  createUserUrl: createUrl(localUrlBase, '/users/create'),
  fetchUserUrl: (id) => createUrl(localUrlBase, `/users/${id}`),
  updateUserUrl: (id) => createUrl(localUrlBase, `/users/${id}`),
  forgotPasswordUrl: createUrl(localUrlBase, '/auth/forgot-password'),
  logoutUrl: createUrl(localUrlBase, '/auth/logout'),
  getProfileUrl: createUrl(localUrlBase, '/auth/profile'),
  getRoleUrl: createUrl(localUrlBase, '/users/getRole'),
  loginUrl: createUrl(localUrlBase, '/auth/login'),
  resetPasswordUrl: createUrl(localUrlBase, '/users/reset-password'),

};

// Hosted URLs
const hostedUserUrls = {
    getUsersUrl: createUrl(localUrlBase, '/users/getUsers'),
    deleteUserUrl: createUrl(localUrlBase, '/users/delete'),
    createUserUrl: createUrl(localUrlBase, '/users/create'),
    fetchUserUrl: (id) => createUrl(localUrlBase, `/users/${id}`),
    updateUserUrl: (id) => createUrl(localUrlBase, `/users/${id}`),
    forgotPasswordUrl: createUrl(localUrlBase, '/auth/forgot-password'),
    logoutUrl: createUrl(localUrlBase, '/auth/logout'),
    getProfileUrl: createUrl(localUrlBase, '/auth/profile'),
    getRoleUrl: createUrl(localUrlBase, '/users/getRole'),
    loginUrl: createUrl(localUrlBase, '/auth/login'),
    resetPasswordUrl: createUrl(localUrlBase, '/users/reset-password'),
};

export { userUrls, hostedUserUrls };
