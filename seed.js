const mongoose = require('mongoose');
const Item = require('./models/item');  // Adjust the path as needed

mongoose.connect('mongodb://localhost:27017/bakery', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Connected to MongoDB');
        
        // Define the sample items with correct image URLs
        const items = [
            { name: 'Chocolate Cake', price: 20.00, description: 'Delicious chocolate cake', image: '/images/choco.jpg' },
            { name: 'Vanilla Cupcake', price: 2.50, description: 'Tasty vanilla cupcake', image: '/images/2.jpg' },
            { name: 'Strawberry Shortcake', price: 15.00, description: 'Fresh strawberry shortcake', image: '/images/3.jpg' },
            { name: 'Lemon Tart', price: 12.00, description: 'Tangy lemon tart', image: '/images/4.jpg' },
            { name: 'Cheesecake', price: 18.00, description: 'Classic cheesecake', image: '/images/5.jpg' },
            { name: 'Blueberry Muffin', price: 3.00, description: 'Moist blueberry muffin', image: '/images/6.jpg' },
            { name: 'Brownies', price: 2.00, description: 'Chewy chocolate brownies', image: '/images/7.jpg' },
            { name: 'Apple Pie', price: 14.00, description: 'Homemade apple pie', image: '/images/8.jpg' },
            { name: 'Cinnamon Roll', price: 4.00, description: 'Warm cinnamon roll', image: '/images/9.jpg' },
            { name: 'Macarons', price: 1.50, description: 'Colorful macarons', image: '/images/10.jpg' },
            { name: 'Pumpkin Pie', price: 16.00, description: 'Spiced pumpkin pie', image: '/images/11.jpg' },
            { name: 'Red Velvet Cake', price: 22.00, description: 'Rich red velvet cake', image: '/images/12.jpg' },
            { name: 'Tiramisu', price: 17.00, description: 'Classic tiramisu', image: '/images/13.jpg' },
            { name: 'Peach Cobbler', price: 13.00, description: 'Sweet peach cobbler', image: '/images/14.jpg' },
            { name: 'Pecan Pie', price: 18.00, description: 'Rich pecan pie', image: '/images/15.jpg' },
            { name: 'Almond Cake', price: 19.00, description: 'Delicate almond cake', image: '/images/16.jpg' },
            { name: 'Fruit Tart', price: 14.00, description: 'Fresh fruit tart', image: '/images/17.jpg' }
        ];

        // Clear existing items
        await Item.deleteMany({});

        // Insert the sample items into the database
        await Item.insertMany(items);
        console.log('Sample items added to the database');

        // Close the database connection
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error connecting to MongoDB or inserting data', err);
    });
