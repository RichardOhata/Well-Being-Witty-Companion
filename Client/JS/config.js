const localUrlBase = 'http://localhost:3000';
const hostedUrlBase = 'https://nest.comp4537.com';

// Function to create a full URL by appending the endpoint to the base URL
const createUrl = (base, endpoint) => `${base}${endpoint}`;
//to switch between the hosted and local urls, just swap the names of the objects
// e.g switch userUrls1 and userUrls
// User-related URLs
const userUrls1 = {
  getUsersUrl: createUrl(localUrlBase, '/users/getUsers'), 
  deleteUserUrl: createUrl(localUrlBase, '/users/delete'), // {id}
  createUserUrl: createUrl(localUrlBase, '/users/create'), // {username, email, password}
  fetchUserUrl: (id) => createUrl(localUrlBase, `/users/${id}`),
  updateUserUrl: (id) => createUrl(localUrlBase, `/users/${id}`),
  forgotPasswordUrl: createUrl(localUrlBase, '/auth/forgot-password'), // {email}
  logoutUrl: createUrl(localUrlBase, '/auth/logout'),
  getProfileUrl: createUrl(localUrlBase, '/auth/profile'), 
  getRoleUrl: createUrl(localUrlBase, '/users/getRole'),
  loginUrl: createUrl(localUrlBase, '/auth/login'), // {email}
  resetPasswordUrl: createUrl(localUrlBase, '/users/reset-password'), // {password}
  
  getStatsUrl: createUrl(localUrlBase, '/stats/getStats'), 

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

    getStatsUrl: createUrl(hostedUrlBase, '/stats/getStats'), 

    // below is for testing from logging in via another server. 
    //loginUrl : "https://comp4537.com/assignments/assignment2/api/COMP4537/witty/login"

};

export { userUrls };
