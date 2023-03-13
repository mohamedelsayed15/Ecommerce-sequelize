const Sequelize = require('sequelize')

const sequelize = require('../util/mysql')

const Product = sequelize.define('product', {

    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true 
    },
    tittle: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [5 , 50]
        }
    },
    description :{
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [5 , 150]
        }
    },
    price :{
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    image_url: {
        type: Sequelize.STRING,
        allowNull: false,
    }
})

module.exports = Product