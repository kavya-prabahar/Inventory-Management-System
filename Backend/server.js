const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const app = express();

app.use(express.json()); // Use this for parsing JSON request bodies

// CORS Middleware
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

// Session management middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: 'mongodb+srv://kavya_prabahar:abcdefgh12345@ims.sunqv.mongodb.net/?retryWrites=true&w=majority&appName=IMS',
      ttl: 24 * 60 * 60, // Sessions expire after 24 hours
    }),
    cookie: { secure: false }, // Set `secure: true` if using HTTPS
  })
);

// Logging middleware to track all incoming requests
app.use((req, res, next) => {
  console.log(`\n[${new Date().toISOString()}] ${req.method} request to ${req.url}`);
  console.log('Request Headers:', req.headers); // Log request headers for debugging
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Request Body:', req.body); // Log request body if it exists
  }
  next();
});

// MongoDB connection
mongoose
  .connect(
    'mongodb+srv://kavya_prabahar:abcdefgh12345@ims.sunqv.mongodb.net/?retryWrites=true&w=majority&appName=IMS',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log('MongoDB successfully connected to IMS database'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  organization: String,
  products: [
    {
      id: Number,
      name: String,
      code: String,
      price: Number,
      quantity: Number,
    },
  ],
});

const User = mongoose.model('User', userSchema, 'user-details');

// Route to handle registration
app.post('/register', async (req, res) => {
  console.log('Received registration request with body:', req.body);
  const { username, email, password, organization } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      organization,
    });
    await newUser.save();

    console.log('User registered successfully:', email);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration process:', error);
    res.status(500).json({ message: 'Internal server error during registration' });
  }
});

// Route to handle login
app.post('/login', async (req, res) => {
  console.log('Received login request:', req.body);
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ message: 'User not found' });
    }

    console.log('Checking password...');
    const match = await bcrypt.compare(password, user.password);
    console.log(match)
    if (!match) {
      console.log('Password mismatch for user:', email);
      return res.status(400).json({ message: 'Incorrect password' });
    }

    req.session.userId = user._id; 
    console.log('Login successful for user:', email);
    const token = await bcrypt.hash(password, 10);
    console.log(token)
    res.status(200).json({ message: 'Login successful',token });
  } catch (error) {
    console.error('Error during login process:', error);
    res.status(500).json({ message: 'Internal server error during login' });
  }
});

// Route to handle logout
app.post('/logout', (req, res) => {
  console.log('Received logout request');
  req.session.destroy((err) => {
    if (err) {
      console.error('Error during logout:', err);
      return res.status(500).json({ message: 'Internal server error during logout' });
    }

    console.log('Logout successful');
    res.status(200).json({ message: 'Logout successful' });
  });
});


// Route to handle product updates
app.post('/update-product', async (req, res) => {
  console.log('Received request to update products:', req.body); // Log the request body

  const { email, products } = req.body;

  if (!email || !Array.isArray(products)) {
    console.error('Invalid request: Missing email or products');
    return res.status(400).json({ message: 'Invalid request: Missing email or products' });
  }

  if (products.length === 0) {
    console.error('Invalid request: Products array is empty');
    return res.status(400).json({ message: 'Invalid request: Products array is empty' });
  }

  // Check for valid product data
  for (const product of products) {
    console.log('Checking product:', product); // Log each product for debugging
    if (
      !product.name ||
      !product.code ||
      typeof product.price !== 'number' ||
      typeof product.quantity !== 'number'
    ) {
      console.error('Invalid product data found:', product);
      return res.status(400).json({ message: 'Invalid product data' });
    }
  }

  try {
    console.log('Fetching user by email:', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.error('User not found for email:', email);
      return res.status(400).json({ message: 'User not found' });
    }

    // Update or add products
    products.forEach(product => {
      const existingProduct = user.products.find(p => p.id === product.id);
      if (existingProduct) {
        // Update existing product
        existingProduct.name = product.name;
        existingProduct.code = product.code;
        existingProduct.price = product.price;
        existingProduct.quantity = product.quantity;
        console.log(`Updated product with id: ${product.id}`);
      } else {
        // Add new product
        user.products.push(product);
        console.log(`Added new product with id: ${product.id}`);
      }
    });

    await user.save(); // Save the changes to the database
    console.log('Products updated successfully for user:', email);
    res.status(200).json({ message: 'Products updated successfully' });
  } catch (error) {
    console.error('Error during product update:', error);
    res.status(500).json({ message: 'Error updating products', error: error.message });
  }
});

// Route to handle product deletion by product code
app.delete('/delete-product', async (req, res) => {
  console.log('Received request to delete product:', req.body);

  const { email, code } = req.body; // Get email and product code from request body

  if (!email || !code) {
    console.error('Invalid request: Missing email or product code');
    return res.status(400).json({ message: 'Invalid request: Missing email or product code' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.error('User not found for email:', email);
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the product by code and delete it
    const initialProductCount = user.products.length;
    user.products = user.products.filter(product => product.code !== code);

    // Check if a product was deleted
    if (user.products.length === initialProductCount) {
      console.error('Product not found for code:', code);
      return res.status(404).json({ message: 'Product not found' });
    }

    await user.save(); // Save changes to the database
    console.log('Product deleted successfully with code:', code);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error during product deletion:', error);
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});


// Test route to verify server status
app.get('/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ message: 'Server is running correctly' });
});

// Test route to handle raw body requests
app.post('/test-body', (req, res) => {
  console.log('Received test body request:', req.body); // Log the request body for inspection
  res.json(req.body); // Echo back the body
});

// Catch-all route for 404
app.use((req, res) => {
  console.error(`404 - Not Found: ${req.method} ${req.url}`);
  res.status(404).send('Not found');
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error occurred:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
