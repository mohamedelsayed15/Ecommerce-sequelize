const Sequelize = require('sequelize')

const sequelize = require('../util/mysql')

const Cart = sequelize.define('cart', {

    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true 
    }
})
const CartItem = sequelize.define('cartItem', {

    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true 
    },
    quantity: Sequelize.INTEGER
})


module.exports = {Cart ,CartItem}
