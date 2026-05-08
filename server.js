const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require('path');
const app = express();
require('dotenv').config();




app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'fashionsecret',
    resave: false,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

db.connect((err) => {
    if (err) {
        console.log("❌ DB ERROR:", err);
    } else {
        console.log("✅ MySQL CONNECTED");
    }
});

app.get('/', (req, res) => {

    db.query('SELECT * FROM products', (err, results) => {

        if (err) {
            console.log(err);
            return res.send('Database Error');
        }

        res.render('index', {
            products: results,
            user: req.session.user
        });

    });

});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {

    const { email, password } = req.body;

    db.query(
        'SELECT * FROM users WHERE email=?',
        [email],
        async (err, result) => {

            if (result.length > 0) {

                const user = result[0];

                const match = await bcrypt.compare(password, user.password);

                if (match) {

                    req.session.user = user;

                    return res.redirect('/dashboard');

                }

            }

            res.send('Login gagal');

        }
    );

});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {

    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
        'INSERT INTO users(name,email,password) VALUES(?,?,?)',
        [name, email, hashedPassword],
        (err) => {

            if (err) throw err;

            res.redirect('/login');

        }
    );

});

app.get('/dashboard', (req, res) => {

    if (!req.session.user) {
        return res.redirect('/login');
    }

    res.render('dashboard', {
        user: req.session.user
    });

});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
