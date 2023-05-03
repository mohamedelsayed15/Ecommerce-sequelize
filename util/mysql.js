const Sequelize = require('sequelize')


// const sequelize = new Sequelize(
//     'ecommerce',
//     'me',
//     '621654', {
//         dialect: 'mysql',
//         host :'127.0.0.1',
//         storage: "./session.mysql",
//     }
// )
const sequelize = new Sequelize(
    process.env.MYSQL_URL,
    {
        dialect: 'mysql',
        storage: './session.mysql'
    });

    // process.env.MYSQLDATABASE,
    // process.env.MYSQLUSER,
    // process.env.MYSQLPASSWORD,
 // host: process.env.MYSQLHOST,
        // port: process.env.MYSQLPORT,

module.exports = sequelize