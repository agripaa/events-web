const {Sequelize} = require('sequelize');

const db = new Sequelize('events','root', '', {
    dialect: 'mysql',
    host: 'localhost',
    logging: (...msg) => console.log(msg)
});

module.exports = db;

try {
    db.authenticate();
    console.log('connection has been established');
} catch (err) {
    console.error(err);
    
}