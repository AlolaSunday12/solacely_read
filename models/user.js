const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import the sequelize instance

// Define the User model
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Username is required." }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: { msg: "Please enter a valid email address." }, // Ensure it's a valid email
    }

  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [6], // Validate password length between 6 and 100 characters
        msg: "Password must be at least 6 characters long."
      }
    }
  },
  googleId: {
    type: DataTypes.STRING,
    allowNull: true,
   // unique: true,
    select: false,
  },
  
  facebookId: {
    type: DataTypes.STRING,
    allowNull: true,
    //unique: true,
    select: false,
  },
  
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  otp: {
    type: DataTypes.STRING, // Store OTP
    allowNull: true,
  },
  otpExpires: {
    type: DataTypes.DATE, // Store OTP expiration time
    allowNull: true,
  },

}, {
  tableName: 'users', // Specify the table name
  timestamps: true,  // Automatically manage createdAt and updatedAt columns
  
  indexes: [
    {
      unique: true,
      fields: ['googleId', 'facebookId'],
    },
  ],
  
});

module.exports = User;