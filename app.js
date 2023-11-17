const express = require('express');
const mysql = require('mysql');
const query = require('./query')
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt')
const saltRounds = 10;
const app = express();

app.use(express.json());
app.use(cookieParser());

const secretKey = ' 256-bit-secret' // Change this to more secure key in the future
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

const jwtAuthentication = (req, res, next) => {
    const token = req.cookies.token;
    console.log(token)
    if (!token) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized",
            message: "No token provided.",
        });
    }
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                success: false,
                error: "Unauthorized",
                message: "Failed to authenticate token.",
            });
        }
        req.user = decoded;
        next();
    });
}



app.post('/assignments/assignment1/api/create', (req, res) => {
    console.log("hi there")
    console.log(req.body)
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    const values = [req.body.username, hashedPassword, req.body.email];

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
    const values = [req.body.username]; // Changed from email to username
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
                message: "No such user exists.",
            };
            res.status(401).json(response);
        } else {
            if (bcrypt.compareSync(req.body.password, result[0].password)) {
                const user = {
                    username: result[0].username,
                    email: result[0].email,
                }
                const token = jwt.sign(user, secretKey, {
                    expiresIn: '1hr'
                })
                res.cookie('token', token, {
                    path:"/",
                    secure: true,
                    httpOnly: true,
                    sameSite: "none",
                    // maxAge: 3600000,
                    expires: new Date(Date.now() + 3600000),
                }) // Change secure to true if hosted
                const response = {
                    success: true,
                    message: 'Login successful',
                    user: result[0], // Assuming result is an array with at most one user
                };
                res.status(200).json(response);
            } else {
                const response = {
                    success: false,
                    error: "Invalid credentials",
                    message: "Username or password is incorrect",
                };
                res.status(401).json(response);
            }
        }
    });
});

// For Testing
app.get('/test', jwtAuthentication, (req, res) => {
    res.send({
        apple: 123
    })
})  

app.listen(8000);