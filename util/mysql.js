const Sequelize = require('sequelize')


const sequelize = new Sequelize(
    'ecommerce',
    'me',
    '621654', {
        dialect: 'mysql',
        host :'127.0.0.1',
        storage: "./session.mysql",
    }
)

module.exports = sequelize