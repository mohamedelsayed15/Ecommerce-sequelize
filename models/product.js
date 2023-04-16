const Sequelize = require('sequelize')

const sequelize = require('../util/mysql')
//Product table add 'comments' array to it

const Product = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true 
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description :{
        type: Sequelize.TEXT('medium'),
        allowNull: false
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
    },
    //add comments array using JSON datatype mysql to it
    comments: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: [],
        get() {
            return this.getDataValue('comments')
        },
        set(val) {
            this.setDataValue('comments', val)
        }
    }
})

module.exports = Product
