// const mysql = require('mysql2');
const Sequelize = require('sequelize');
// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node-complete',
//     password: 'London44'
// });

const sequelize = new Sequelize('node-complete', 'root', 'London44', { dialect: 'mysql', host: 'localhost' });
module.exports = sequelize;