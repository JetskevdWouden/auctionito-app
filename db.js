const Sequelize = require('sequelize');
const databaseUrl = process.env.DATABASE_URL || 'postgres://postgres:hello@localhost:5432/postgres';

const sequelize = new Sequelize(databaseUrl);

sequelize
    .sync()     //{force:true}    
    .then(() => console.log('Database schema updated'))
    .catch(console.error)

module.exports = sequelize;