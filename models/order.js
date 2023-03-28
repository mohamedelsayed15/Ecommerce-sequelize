const Sequelize = require('sequelize')

const sequelize = require('../util/mysql')

const Order = sequelize.define('order', {

    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true 
    }
})

const OrderItem = sequelize.define('orderItem', {

    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true 
    },
    quantity: Sequelize.INTEGER
})


module.exports = {Order ,OrderItem}
