const Sequelize = require('sequelize')


const sequelize = new Sequelize(
    'ecommerce',
    'me',
    '621654', {
        dialect: 'mysql',
        host :'0.0.0.0',
        storage: "./session.mysql",
    }
)

module.exports = sequelize