const Sequelize = require('sequelize')

const sequelize = require('../util/mysql')

const Product = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true 
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [10 , 150]
        }
    },
    description :{
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [10 , 2000]
        }
    },
    price :{
        type: Sequelize.DOUBLE,
        allowNull: false,
        validate: {
            min:0.1
        }
    },
    image_url: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isUrl: true
        }
    }
})

module.exports = Product
