const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
const app = express();
require('dotenv').config();

const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.connect((err) => {
    if(err){
        console.log("Database Error:", err);
    } else {
        console.log("Database Connected");
    }
});

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
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Database Connected');
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

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

// ====================
// CART SIDEBAR
// ====================

let cart = [];

function toggleCart(){
    document.getElementById('cartSidebar')
        .classList.toggle('active');

    document.getElementById('cartOverlay')
        .classList.toggle('active');
}

// ADD TO CART
function addToCart(name, price, image){

    cart.push({
        name,
        price,
        image
    });

    updateCart();
}

// UPDATE CART
function updateCart(){

    const cartItems =
        document.getElementById('cart-items');

    const cartCount =
        document.getElementById('cart-count');

    const cartTotal =
        document.getElementById('cart-total');

    cartItems.innerHTML = '';

    let total = 0;

    cart.forEach(item => {

        total += item.price;

        cartItems.innerHTML += `
            <div class="cart-item">

                <img src="${item.image}">

                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price}</p>
                </div>

            </div>
        `;
    });

    cartCount.innerText = cart.length;
    cartTotal.innerText = total;

    if(cart.length === 0){
        cartItems.innerHTML =
        `<p class="empty-cart">
            Cart is empty
        </p>`;
    }
}

// CART PAGE
app.get('/cart', (req, res) => {

    if (!req.session.cart) {
        req.session.cart = [];
    }

    res.render('cart', {
        cart: req.session.cart,
        user: req.session.user
    });

});
// ADD TO CART
app.get('/cart/add/:id', (req, res) => {

    const productId = req.params.id;

    db.query(
        'SELECT * FROM products WHERE id = ?',
        [productId],
        (err, result) => {

            if (err) throw err;

            if (!req.session.cart) {
                req.session.cart = [];
            }

            req.session.cart.push(result[0]);

            res.redirect('/cart');
        }
    );


    
});

