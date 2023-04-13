const Sequelize = require('sequelize')
const sequelize = require('../util/mysql')
const bcrypt = require('bcryptjs')

const User = sequelize.define('user', {

    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true 
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [5 , 50]
        }
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [5 , 50]
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [6 , 20]
        }
    },
    resetToken: Sequelize.STRING,
    resetTokenExpiration: Sequelize.DATE
    
},
    {
    /* Indexes are used to find rows with specific column values quickly. 
    Without an index, 
    MySQL must begin with the first row and then read through the entire table to find the relevant rows.
    The larger the table, the more this costs. If the table has an index for the columns in question, 
    MySQL can quickly determine the position to seek to in the middle of the data file without having to look at all the data.
    This is much faster than reading every row sequentially. */
    indexes: [
    {
        unique: true,
        fields: ['email']
    }
    ]
})
User.beforeSave(async (user) => {
    if (user.changed('password')) {

        user.password = await bcrypt.hash(user.password, 8)

    }
})

//tokens table
const Token = sequelize.define('Token', {
    token: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
})

module.exports = { User , Token}