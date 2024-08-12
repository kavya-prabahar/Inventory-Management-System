const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection to the "IMS" database
mongoose.connect('mongodb://localhost:27017/IMS', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected to IMS database'))
  .catch(err => console.log(err));

// User Schema with organization field
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  organization: String, // Added the organization field
});

// Specify the collection name as "user-details"
const User = mongoose.model('User', userSchema, 'user-details');

// Route to handle registration
app.post('/register', async (req, res) => {
  const { username, email, password, organization } = req.body; // Include organization in request

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Create a new user with the organization field
  const newUser = new User({ username, email, password, organization });
  await newUser.save();

  res.status(201).json({ message: 'User registered successfully' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
