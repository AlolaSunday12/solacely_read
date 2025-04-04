const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const sequelize = require('./config/db');  // Sequelize instance
const authRoute = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const authCheck = require('./middleware/authMiddleware')
const User = require('./models/user')
const multer = require('multer');
const path = require('path');
const SequelizeStore = require("connect-session-sequelize")(session.Store);
//const { sequelize } = require('./models');
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
  credentials: true,
}));

// Body parser setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/Public/uploads', express.static(path.join(__dirname, '/Public/uploads')));

// Session middleware (must come before passport session middleware)
const sessionStore = new SequelizeStore({
  db: sequelize,
  checkExpirationInterval: 15 * 60 * 1000, // Clean expired sessions every 15 min
  expiration: 30 * 60 * 1000 // Sessions expire in 30 min
});
app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: { secure: false }  // Change to true in production
}));


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log("SESSION:", req.session);
  console.log("USER:", req.user);
  next();
});

// Routes
app.use('/auth', authRoute);
app.use('/profile', authRoute);
app.use('/user', userRoutes);


app.get('/', authCheck, (req, res) => {
  res.status(200).json({ message: "Hello, PostgreSQL!", user: req.user });
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