import {serverStrings} from './strings'

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


db.connect((err) => {
    if (err) {
        console.error(serverStrings.dbConnectErr , err);
    } else {
        console.log(serverStrings.dbConnectSuccess);
    }
});

db.query(query.createUserTable, (err, result) => {
    if (err) {
        console.error(serverStrings.dbTableErr, err);
    } else {
        console.log(serverStrings.userTableSuccess);
    }
});

db.query(query.createReqTrackingTable, (err, result) => {
    if (err) {
        console.error(serverStrings.dbTableErr, err);
    } else {
        console.log(serverStrings.requestTableSuccess);
    }
});


router.use(function (req, res, next) {
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
    const token = req.cookies.access_token;
    try {
        const payload = jwt.verify(token, secretKey);
        req.payload = payload
        next()
    } catch (err) {
        res.clearCookie('token');
        res.status(401).json({
            success: false,
            error: serverStrings.unauthorized,
            message: serverStrings.authFail,
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
                error: serverStrings.userConflict,
                message: `${serverStrings.email} ${req.body.email} ${serverStrings.exists}`,
            };

            res.status(409).json(response);
        } else {
          incrementReqCount('POST', '/create')
            const response = {
                success: true,
                message: serverStrings.userRegisterSuccess,
                username: req.body.username,
                email: req.body.email,
            };
            res.status(201).json(response);
        }
    });
});

router.post('/login', (req, res) => {
    const values = [req.body.email]; 
    db.query(query.SQL_SELECT_USER, values, (err, result) => {
        if (err) {
            const response = {
                success: false,
                error: serverStrings.dbError,
                message: serverStrings.dbErrMsg,
            };

            res.status(500).json(response);
        } else if (result.length === 0) {
            const response = {
                success: false,
                error: serverStrings.invalidCred,
                message: serverStrings.userExists,
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
                    message: serverStrings.loginSuccess,
                    user: result[0], // Assuming result is an array with at most one user
                };
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
                    error: serverStrings.invalidCred,
                    message: serverStrings.incorrectCred,
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
    incrementReqCount('GET', '/logout')
    res.status(200).json({ message: serverStrings.logoutSuccess });
});

// Example of how to access payload data 
// Not logged in user can't call this where a logged in user can
router.get('/test', jwtAuthentication, (req, res) => {
    console.log(req.payload); // view payload data from cookie
    res.send({
        apple: 123
    })
});

router.get('/getStats', jwtAuthentication, (req, res) => {
    db.query(query.selectReqData, (err, result) => {
        if (err) {
            const response = {
                success: false,
                error: serverStrings.dbError,
                message:serverStrings.dbErrMsg,
            };
            res.status(500).json(response);
    } else {
        res.status(200).json(result)
    }   
    })
})

router.get('/', (req, res) => {
    res.send(serverStrings.helloWorld);
  });

app.listen(3000, () => {
    console.log(serverStrings.serverStartup);
  });
  