const localUrlBase = 'http://localhost:3000';
const hostedUrlBase = 'https://nest.comp4537.com';

// Function to create full URL by appending the endpoint to the base URL
const createUrl = (base, endpoint) => `${base}${endpoint}`;

// User-related URLs
const getUsersUrl = createUrl(localUrlBase, '/users/getUsers');
const getProfileUrl = (id) => createUrl(localUrlBase, `/auth/profile/${id}`);
const forgotPasswordUrl = createUrl(localUrlBase, '/auth/forgot-password');
const logoutUrl = createUrl(localUrlBase, '/auth/logout');
const getRoleUrl = createUrl(localUrlBase, '/users/getRole');
const loginUrl = createUrl(localUrlBase, '/auth/login');
const resetPasswordUrl = createUrl(localUrlBase, '/users/reset-password');
const createUserUrl = createUrl(localUrlBase, '/users/create');

// // Hosted URLs
// const getUsersUrl = createUrl(hostedUrlBase, '/users/getUsers');
// const getProfileUrl = (id) => createUrl(hostedUrlBase, `/auth/profile/${id}`);
// const forgotPasswordUrl = createUrl(hostedUrlBase, '/auth/forgot-password');
// const logoutUrl = createUrl(hostedUrlBase, '/auth/logout');
// const getRoleUrl = createUrl(hostedUrlBase, '/users/getRole');
// const loginUrl = createUrl(hostedUrlBase, '/auth/login');
// const resetPasswordUrl = createUrl(hostedUrlBase, '/users/reset-password');
// const createUserUrl = createUrl(hostedUrlBase, '/users/create');

