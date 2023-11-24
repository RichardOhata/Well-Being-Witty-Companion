const localUrlBase = 'http://localhost:3000';
const hostedUrlBase = 'https://nest.comp4537.com';

// Function to create a full URL by appending the endpoint to the base URL
const createUrl = (base, endpoint) => `${base}${endpoint}`;

// User-related URLs
const userUrls1 = {
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
const userUrls = {
    getUsersUrl: createUrl(hostedUrlBase, '/users/getUsers'),
    deleteUserUrl: createUrl(hostedUrlBase, '/users/delete'),
    createUserUrl: createUrl(hostedUrlBase, '/users/create'),
    fetchUserUrl: (id) => createUrl(hostedUrlBase, `/users/${id}`),
    updateUserUrl: (id) => createUrl(hostedUrlBase, `/users/${id}`),
    forgotPasswordUrl: createUrl(hostedUrlBase, '/auth/forgot-password'),
    logoutUrl: createUrl(hostedUrlBase, '/auth/logout'),
    getProfileUrl: createUrl(hostedUrlBase, '/auth/profile'),
    getRoleUrl: createUrl(hostedUrlBase, '/users/getRole'),
    loginUrl: createUrl(hostedUrlBase, '/auth/login'),
    resetPasswordUrl: createUrl(hostedUrlBase, '/users/reset-password'),
};

export { userUrls };
