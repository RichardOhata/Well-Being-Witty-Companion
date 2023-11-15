const createUserTable = `
    CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,  
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    apicalls INT DEFAULT 0,
    token VARCHAR(255), 
    admin BOOLEAN DEFAULT FALSE
);`
const SQL_INSERT_USER = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';

const SQL_SELECT_USER = 'SELECT * FROM users WHERE email = ? AND password = ?';

module.exports = {
    createUserTable,
    SQL_INSERT_USER,
    SQL_SELECT_USER
}