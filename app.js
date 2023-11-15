
const express = require('express');
const mysql = require('mysql');
const app = express();


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '*******',
    database: 'compcom_nodemysql'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the database');
    }
});

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

  db.query(createUserTable, (err, result) => {
    if (err) {
      console.error('Error creating the table:', err);
    } else {
      console.log('Table "users" created successfully');
    }
  });


app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});


app.post('/assignments/assignment1/api/create', (req, res) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    
    console.log("hi there")

    req.on('end', () => {
        const parsedQuery = JSON.parse(body);
        console.log(parsedQuery)
        const SQL_INSERT_USER = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
        const values = [parsedQuery.username, parsedQuery.password, parsedQuery.email];

        db.query(SQL_INSERT_USER, values, (err, result) => {
            if (err) {
                const response = {
                    success: false,
                    error: "User conflict",
                    message: `The email ${parsedQuery.email} already exists.`,
                };

                res.status(409).json(response);
            } else {
                const response = {
                    success: true,
                    message: 'User registered successfully',
                    username: parsedQuery.username,
                    email: parsedQuery.email,
                };
                res.status(201).json(response);
            }
        });
    });
});

app.post('/assignments/assignment1/api/login', (req, res) => {
    let body = '';

    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', () => {
        const parsedQuery = JSON.parse(body);

        const SQL_SELECT_USER = 'SELECT * FROM users WHERE email = ? AND password = ?';
        const values = [parsedQuery.email, parsedQuery.password];

        db.query(SQL_SELECT_USER, values, (err, result) => {
            if (err) {
                const response = {
                    success: false,
                    error: "Database error",
                    message: "Error querying the database.",
                };

                res.status(500).json(response);
            } else if (result.length === 0) {
                const response = {
                    success: false,
                    error: "Invalid credentials",
                    message: "Email or password is incorrect.",
                };

                res.status(401).json(response);
            } else {
                const response = {
                    success: true,
                    message: 'Login successful',
                    user: result[0], // Assuming result is an array with at most one user
                };
                res.status(200).json(response);
            }
        });
    });
});


  
  app.listen();