const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Item = require('./models/Item');
const User = require('./models/user');
const bcrypt = require('bcrypt');

const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: '123', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Set to true if using HTTPS
}));

// Initialize cart in session if not exists
app.use((req, res, next) => {
    if (!req.session.cart) {
        req.session.cart = { items: [] };
    }
    next();
});

// EJS Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/bakery', { useNewUrlParser: true, useUnifiedTopology: true });


// Routes

// Home Route
app.get('/', /* authenticateToken, */ async (req, res) => {  // JWT authentication removed
    try {
        const bestSellers = await Item.find().limit(3);
        res.render('index', { bestSellers });
    } catch (err) {
        res.status(500).send("Error retrieving best-selling items");
    }
});

// Menu Route
app.get('/menu', /* authenticateToken, */ async (req, res) => {  // JWT authentication removed
    try {
        const items = await Item.find();
        res.render('menu', { items });
    } catch (err) {
        res.status(500).send("Error retrieving menu items");
    }
});

// Cart Route
app.get('/cart', (req, res) => {
    res.render('cart', { cart: req.session.cart });
});

// Add Item to Cart
app.post('/cart/add', async (req, res) => {
    const { itemId, quantity } = req.body;
    try {
        const item = await Item.findById(itemId);
        if (!item) return res.status(404).send("Item not found");

        const cartItem = req.session.cart.items.find(ci => ci.item._id.toString() === itemId);
        if (cartItem) {
            cartItem.quantity += parseInt(quantity);
        } else {
            req.session.cart.items.push({ item, quantity: parseInt(quantity) });
        }

        res.redirect('/cart');
    } catch (err) {
        res.status(500).send("Error adding item to cart");
    }
});

// Update Cart
app.post('/cart/update', (req, res) => {
    const { itemId, quantity } = req.body;
    const cartItem = req.session.cart.items.find(ci => ci.item._id.toString() === itemId);

    if (cartItem) {
        cartItem.quantity = parseInt(quantity);
    }

    res.redirect('/cart');
});

// Delete from Cart
app.post('/cart/delete', (req, res) => {
    const { itemId } = req.body;
    req.session.cart.items = req.session.cart.items.filter(ci => ci.item._id.toString() !== itemId);
    res.redirect('/cart');
});

// Registration Routes
app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = new User({ username, password });
        await user.save();
        res.redirect('/login');
    } catch (err) {
        res.status(500).send("Error registering user");
    }
});

// Login Routes
app.get('/login', (req, res) => {
    res.render('login', { errorMessage: null });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && await user.comparePassword(password)) {
            
            res.redirect('/');
        } else {
            res.render('login', { errorMessage: "Invalid username or password" });
        }
    } catch (err) {
        res.status(500).send("Error logging in");
    }
});

// Logout Route
app.get('/logout', (req, res) => {
   
    res.redirect('/login');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
