const createUserTable = `
    CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,  
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    apicalls INT DEFAULT 0,
    admin BOOLEAN DEFAULT FALSE
);`


const createReqTrackingTable = `
CREATE TABLE IF NOT EXISTS request_tracking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    method VARCHAR(10) NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    request_count INT NOT NULL DEFAULT 0,
    last_served_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description VARCHAR(255)
)
`;

const initalReqData = `
INSERT INTO request_tracking (method, endpoint, request_count, description)
VALUES 
('POST', '/create', 0, 'Registers a new user'),
('POST', '/login', 0, 'Logs in a user'),
('POST', 'users/create', 0, 'Creates a new user'),
('POST', 'auth/forgot-password', 0, 'Initiates password reset'),
('POST', 'users/reset-password', 0, 'Resets user password'),

('GET', '/logout', 0, 'Logs out a user'),
('GET', 'users/getUsers', 0, 'Gets a list of users'),
('GET', 'users/getRole', 0, 'Gets user roles'),
('GET', 'users/:id', 0, 'Gets user details by ID'),
('GET', 'users/getUsers', 0, 'Gets a list of users'),
('GET', 'auth/profile', 0, 'Gets user profile'),

('PATCH', 'users/:id', 0, 'Updates user details by ID'),

('DELETE', 'users/delete', 0, 'Deletes a user'),
;
`;


const incrementReqCount = `
UPDATE request_tracking
SET request_count = request_count + 1
WHERE method = ? AND endpoint = ?;
`
const selectReqData = `
SELECT * FROM request_tracking
`

const SQL_INSERT_USER = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';

const SQL_SELECT_USER = 'SELECT * FROM users WHERE email = ?';

module.exports = {
    createUserTable,
    createReqTrackingTable,
    incrementReqCount,
    selectReqData,
    SQL_INSERT_USER,
    SQL_SELECT_USER
}