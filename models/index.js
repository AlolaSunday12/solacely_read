const sequelize = require('../config/db');

const { User } = require('./user');
const Comment = require('./comment');
const Reply = require('./reply');

// Define associations here instead of in the individual files
User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId' });

Comment.hasMany(Reply, { foreignKey: 'commentId', as: 'replies' });
Reply.belongsTo(Comment, { foreignKey: 'commentId' });

Reply.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Reply, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Comment,
  Reply
};