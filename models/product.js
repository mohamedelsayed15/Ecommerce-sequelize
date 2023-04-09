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
            len: [10 , 200]
        }
    },
    description :{
        type: Sequelize.TEXT('medium'),
        allowNull: false,
        // validate: {
        //     len: [50 , 1500]
        // }
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
