const {Sequelize} = require('sequelize');

const db = new Sequelize('events-info','root', '', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = db;

try {
    db.authenticate();
    console.log('connection has been established');
} catch (err) {
    console.error(err);
}