// models/Comment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
//const { User } = require('./user');
//const { Reply } = require('../models/reply')

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: 'comments'
});


module.exports = Comment;