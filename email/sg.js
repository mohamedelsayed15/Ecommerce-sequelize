const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key:process.env.SENDGRID_API_KEY
    }
}))

exports.welcomeEmail = (email, name) => { 
    try {
        transporter.sendMail({
            to: email,
            from: 'mo.elsayed621654@gmail.com',
            subject: `Welcome to Trader`,
            html: '<h1> welcome</h1>'
        })
    } catch (e) {
        console.log(e)
    }
}


exports.sendVerificationEmail = (email, name, token) => { 

    try {

        transporter.sendMail({
            to: email,
            from: 'mo.elsayed621654@gmail.com',
            subject: `Task app verification`,
            text: `Hi ${name}!,Please verify your email by clicking the link ${process.env.APP_LINK}user/verifyMe/${token}`
        })
        console.log(`${process.env.APP_LINK}verifyMe/${token}`)
    } catch (e) { 
        console.log(e)
    }
}
exports.sendVerificationPassword = (email, name, token) => { 
    try {
    transporter.sendMail({
        to: email,
        from: 'mo.elsayed621654@gmail.com',
        subject: `Task app verification`,
        text: `Hi ${name}!,Please click the link to reset your password ${process.env.APP_LINK}user/reset-password/${token}`
    })
        console.log(`${process.env.APP_LINK}verifyMe/${token}`)
    } catch (e) { 
        console.log(e)
    }
}
