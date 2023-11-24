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
('POST', '/create', 0, 'Registeres a new user'),
('POST', '/login', 0, 'Logins a user'),
('GET', '/logout', 0, 'Logouts a user')
;
`

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