const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer'); // Import Nodemailer

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

// Route to handle login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  // Check if the password matches
  if (user.password !== password) {
    return res.status(400).json({ message: 'Incorrect password' });
  }

  res.status(200).json({ message: 'Login successful' });
});

// Route to handle contact form submission
app.post('/send-email', (req, res) => {
  const { name, email, message } = req.body;

  // Create a transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'kavyaprabahar0128@gmail.com', // Replace with your email
      pass: 'kavyasatya0105' // Replace with your email password or an app password
    }
  });

  const mailOptions = {
    from: email,
    to: 'kavyaprabahar0128@gmail.com', // Replace with the recipient's email
    subject: `Query from ${name}`,
    text: message
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send('Email sent successfully');
    }
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
