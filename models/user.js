const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import the sequelize instance

const Category = {
  NONE: 'None',
  ALPHA: 'Alpha',
  BRAVO: 'Bravo',
  CHARLIE: 'Charlie',
  DELTA: 'Delta',
};

// Define the User model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  
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
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false, // Set default to false
  },
  category: {
    type: DataTypes.ENUM(...Object.values(Category)), // Store category as an ENUM
    allowNull: false,
    defaultValue: Category.NONE, // Default category
  }

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
/*
User.findAll().then(users => {
  users.forEach(user => {
    user.id = DataTypes.UUIDV4;
    user.save();
  })
})
*/
module.exports = { User, Category };
