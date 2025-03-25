const { Sequelize } = require('sequelize');

// Create a Sequelize instance for PostgreSQL connection
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',  
  password: 'alolasj12',
  database: 'solacely',      
 logging: false,                // Turn off logging (optional)
});

module.exports = sequelize;