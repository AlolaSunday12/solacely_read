const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const sequelize = require('./config/db');  // Sequelize instance
const authRoute = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
require('./config/googleStrategy');  // Passport Google setup
require('./config/facebookStrategy');
require('./config/localStrategy');
require('./config/passport');
require('dotenv').config();

const app = express();

// CORS configuration
const allowedOrigins = ["http://localhost:3000", "http://localhost:5000"];
app.use(cors({
  origin: allowedOrigins,
}));

// Body parser setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware (must come before passport session middleware)
app.use(session({
  secret: process.env.SESSION_KEY,  // Your session secret
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }  // Set to `true` if you're using HTTPS
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoute);
app.use('/profile', authRoute);
app.use('/user', userRoutes);

// Test route to verify everything works
app.get('/', (req, res) => {
  res.send('Hello, PostgreSQL!');
});

// Sync Sequelize models to PostgreSQL
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced successfully');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});