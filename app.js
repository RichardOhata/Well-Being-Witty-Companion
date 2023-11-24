require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const query = require('./query')
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt')
const saltRounds = 10;
const app = express();
const router = express.Router();
app.use(express.json());
app.use(cookieParser());
app.use('/', router);

// const secretKey = require('crypto').randomBytes(64).toString('hex') 
const secretKey = process.env.JWT_SECRET_KEY

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '-',
//     database: '-'
// }); 
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

db.query(query.createReqTrackingTable, (err, result) => {
    if (err) {
        console.error('Error creating the table:', err);
    } else {
        console.log('Table "requestTracking" created successfully');
    }
});


router.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500, https://vivianwebdev.com/Comp4537/witty/Client/HTML/login.html"); // Change later
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With");
    res.setHeader("Access-Control-Allow-Credentials", "true")
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }
    next();
});

const jwtAuthentication = (req, res, next) => {
    const token = req.cookies.access_token;
    console.log("token", token)
    try {
        const payload = jwt.verify(token, secretKey);
        console.log("Payload", payload)
        req.payload = payload
        next()
    } catch (err) {
        res.clearCookie('token');
        res.status(401).json({
            success: false,
            error: "Unauthorized",
            message: "Failed to authenticate token.",
        });
    }
}

const incrementReqCount = (method, endpoint) => {
    const incrementValues = [method, endpoint];
    db.query(query.incrementReqCount, incrementValues, (err, result) => {
        if (err) {
            console.error(err);
        }
    });
}


router.post('/create', (req, res) => {
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
          incrementReqCount('POST', '/create')
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

router.post('/login', (req, res) => {
    console.log("new3")

    const values = [req.body.email]; 
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
                const payload = {
                    sub: result[0].id,
                    email: result[0].email,
                    username: result[0].username,
                    apiCalls: result[0].apicalls
                                }
                const access_token = jwt.sign(payload, secretKey, {
                    expiresIn: '1hr',
                    algorithm: 'HS256'
                })
                const response = {
                    success: true,
                    message: 'Login successful',
                    user: result[0], // Assuming result is an array with at most one user
                };
                console.log("Login successful")
                incrementReqCount('POST', '/login')
                res.cookie('access_token', access_token, {
                    path:"/",
                    secure: true,
                    httpOnly: true,
                    sameSite: "none",
                    maxAge: 3600000,
                })
                res.status(200).json(response);
            } else {
                const response = {
                    success: false,
                    error: "Invalid credentials",
                    message: "Email or password is incorrect",
                };
                res.status(401).json(response);
            }
        }
    });
});


router.get('/logout', (req, res) => {
    // Clear the JWT cookie
    res.cookie('access_token', '', {
        httpOnly: true,
        expires: new Date(0) 
    });
    incrementReqCount('GET', 'logout')
    res.status(200).json({ message: 'Logged out successfully' });
    console.log("Logged out successfully")
});

// Example of how to access payload data 
// Not logged in user can't call this where a logged in user can
router.get('/test', jwtAuthentication, (req, res) => {
    console.log(req.payload); // view payload data from cookie
    res.send({
        apple: 123
    })
});

router.get('/', (req, res) => {
    res.send('Hello, World!');
  });

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
  