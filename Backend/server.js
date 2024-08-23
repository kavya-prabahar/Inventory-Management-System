const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

// Session management
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl:
        'mongodb+srv://kavya_prabahar:abcdefgh12345@ims.sunqv.mongodb.net/?retryWrites=true&w=majority&appName=IMS',
      ttl: 24 * 60 * 60, // Sessions will expire after 24 hours
    }),
    cookie: { secure: false }, // Set `secure: true` if using HTTPS
  })
);

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} request to ${req.url}`);
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
  .then(() => console.log('MongoDB connected to IMS database'))
  .catch((err) => console.error('MongoDB connection error:', err));

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
  console.log('Received registration request');
  const { username, email, password, organization } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

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
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error during registration' });
  }
});

// Route to handle login
app.post('/login', async (req, res) => {
  console.log('Received login request');
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ message: 'User not found' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log('Incorrect password for user:', email);
      return res.status(400).json({ message: 'Incorrect password' });
    }

    req.session.userId = user._id; // Store user ID in session
    console.log('Login successful for user:', email);
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error during login' });
  }
});

// Route to handle logout
app.post('/logout', (req, res) => {
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
  console.log('Received request to update products');
  const { email, products } = req.body;

  if (!email || !Array.isArray(products)) {
    console.error('Invalid request: missing email or products');
    return res.status(400).json({ message: 'Invalid request: missing email or products' });
  }

  if (products.length === 0) {
    console.error('Invalid request: products array is empty');
    return res.status(400).json({ message: 'Invalid request: products array is empty' });
  }

  for (const product of products) {
    if (
      !product.name ||
      !product.code ||
      typeof product.price !== 'number' ||
      typeof product.quantity !== 'number'
    ) {
      console.error('Invalid product data:', product);
      return res.status(400).json({ message: 'Invalid product data' });
    }
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.error('User not found for email:', email);
      return res.status(400).json({ message: 'User not found' });
    }

    user.products = products;
    await user.save();
    console.log('Products updated successfully for user:', email);
    res.status(200).json({ message: 'Products updated successfully' });
  } catch (error) {
    console.error('Error updating products:', error);
    res.status(500).json({ message: 'Error updating products', error: error.message });
  }
});

// Route to handle contact form submission
app.post('/send-email', (req, res) => {
  console.log('Received email sending request');
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'inventrack01@gmail.com', // Replace with your actual email
      pass: 'inventrack0109', // Replace with your actual email password
    },
  });

  const mailOptions = {
    from: email,
    to: 'inventrack01@gmail.com', // Replace with the recipient's email
    subject: `Query from ${name}`,
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send('Email sent successfully');
    }
  });
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running correctly' });
});

// Catch-all route
app.use((req, res) => {
  console.log(`404 - Not Found: ${req.method} ${req.url}`);
  res.status(404).send('Not found');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
