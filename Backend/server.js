const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

// Logging middleware to track all incoming requests
app.use((req, res, next) => {
  console.log(`\n[${new Date().toISOString()}] ${req.method} request to ${req.url}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Request Body:', req.body); // Log request body if it exists
  }
  next();
});

// MongoDB connection
mongoose
  .connect('mongodb://127.0.0.1:27017/ims', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB successfully connected to local IMS database'))
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
  productlist: [
    {id: Number,
    name: String,
    code: String,
    }
  ],
  sales: [
    {
      id: Number,
      name: String,
      code: String,
      price: Number,
      quantity: Number,
      total: Number,
      time: String,
      date: String,
    }
  ]
});

const User = mongoose.model('User', userSchema, 'user-details');

// Add this near your other Mongoose schema definitions

const querySchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});

const Query = mongoose.model('Query', querySchema, 'queries'); // Collection name: 'queries'


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
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Incorrect password' });

    const payload = { userId: user._id, email: user.email, organization: user.organization };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({ message: 'Login successful', token, user: payload });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error during login' });
  }
});

// Middleware to verify JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Endpoint to check if the user is logged in (and retrieve user info)
app.get('/session', authenticateToken, (req, res) => {
  res.status(200).json({ loggedIn: true, user: req.user });
});


// Route to handle logout
app.post('/logout', (req, res) => {
  console.log('Logout requested (JWT)');
  res.status(200).json({ message: 'Logout successful. Please delete the token on client side.' });
});


app.get('/user-details', async (req, res) => {
  console.log('GET /user-details called'); 
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Replace this with your actual DB query
    const user = await User.findOne({ email }); // For MongoDB + Mongoose

    if (user) {
      res.json({
        email: user.email,
        organization: user.organization,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Route to handle product updates
app.post('/update-productname', async (req, res) => {
  console.log('Received request to update products:', req.body); // Log the request body

  const { email, productlist } = req.body;

  if (!email || !Array.isArray(productlist)) {
    console.error('Invalid request: Missing email or products');
    return res.status(400).json({ message: 'Invalid request: Missing email or products' });
  }

  if (productlist.length === 0) {
    console.error('Invalid request: Products array is empty');
    return res.status(400).json({ message: 'Invalid request: Products array is empty' });
  }

  // Check for valid product data
  for (const product of productlist) {
    console.log('Checking product:', product); // Log each product for debugging
    if (
      !product.name ||
      !product.code 
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
    productlist.forEach(product => {
      const existingProduct = user.productlist.find(p => p.id === product.id);
      if (existingProduct) {
        // Update existing product
        existingProduct.name = product.name;
        existingProduct.code = product.code;
        console.log(`Updated product with id: ${product.id}`);
      } else {
        // Add new product
        user.productlist.push(product);
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
app.delete('/delete-productname', async (req, res) => {
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
    const initialProductCount = user.productlist.length;
    user.productlist = user.productlist.filter(product => product.code !== code);

    // Check if a product was deleted
    if (user.productlist.length === initialProductCount) {
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

// Route to fetch user products
app.get('/product-list', async (req, res) => {
  const { email } = req.query; // Get email from query parameters

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ productlist: user.productlist });
  } catch (error) {
    console.error('Error fetching user products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/get-user-data', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      productlist: user.productlist || [],
      products: user.products || [],
    });
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.post('/add-sales', async (req, res) => {
  const { email, salesList } = req.body;

  if (!email || !Array.isArray(salesList)) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    for (const sale of salesList) {
      const product = user.products.find(p => p.code === sale.code);

      if (!product) {
        return res.status(400).json({ message: `Product with code ${sale.code} not found` });
      }

      if (product.quantity < sale.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product ${product.name} (${product.code})`,
        });
      }

      product.quantity -= sale.quantity; // update stock

      user.sales.push({
        id: sale.id,
        name: sale.name,
        code: sale.code,
        price: sale.price,
        quantity: sale.quantity,
        total: sale.total,
        time: sale.time,
        date: sale.date,
      });
    }

    await user.save();
    res.status(200).json({ message: 'Sales saved and stock updated successfully' });
  } catch (err) {
    console.error('Error saving sales:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// Route to fetch user products
app.get('/user-products', async (req, res) => {
  const { email } = req.query; // Get email from query parameters

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      products: user.products || [],
      productlist: user.productlist || [],
    });
  } catch (error) {
    console.error('Error fetching user products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/submit-query', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newQuery = new Query({ name, email, message });
    await newQuery.save();
    console.log('Query saved:', newQuery);
    res.status(201).json({ message: 'Query submitted successfully' });
  } catch (error) {
    console.error('Error saving query:', error);
    res.status(500).json({ message: 'Error saving query' });
  }
});

app.post('/get-sales-by-date', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const salesByDate = {};

    for (const sale of user.sales) {
      if (!salesByDate[sale.date]) {
        salesByDate[sale.date] = [];
      }
      salesByDate[sale.date].push(sale);
    }

    res.status(200).json(salesByDate);
  } catch (err) {
    console.error('Error fetching sales:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
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
