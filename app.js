const express = require('express');
const mysql = require('mysql');
const query = require('./query')
const app = express();

app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'compcom_nodemysql'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the database');
    }
});

db.query(query.createUserTable, (err, result) => {
    if (err) {
        console.error('Error creating the table:', err);
    } else {
        console.log('Table "users" created successfully');
    }
});


app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500"); // Change later
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With");
    res.setHeader("Access-Control-Allow-Credentials", "true")
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }
    next();
});


app.post('/assignments/assignment1/api/create', (req, res) => {

    console.log("hi there")
    console.log(req.body)
    const values = [req.body.username, req.body.password, req.body.email];

    db.query(query.SQL_INSERT_USER, values, (err, result) => {
        if (err) {
            const response = {
                success: false,
                error: "User conflict",
                message: `The email ${req.body.email} already exists.`,
            };

            res.status(409).json(response);
        } else {
            const response = {
                success: true,
                message: 'User registered successfully',
                username: req.body.username,
                email: req.body.email,
            };
            res.status(201).json(response);
        }
    });
});

app.post('/assignments/assignment1/api/login', (req, res) => {
    console.log(req.body)
    const values = [req.body.email, req.body.password]; // Change from email to username depending on what Amir wants
    db.query(query.SQL_SELECT_USER, values, (err, result) => {
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



app.listen(8000);