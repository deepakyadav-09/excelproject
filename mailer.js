const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const hbs = require('nodemailer-express-handlebars')

async function mailToUser(to, userName, subject) {
    const config = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.PASS_KEY
        }
    });
    const hbsData = {
        viewEngine: {
            partialsDir: 'views',
            defaultLayout: false
        },
        viewPath: 'views'
    }
    config.use('compile', hbs(hbsData))
    const mailDetail = {
        from: 'Deepak Yadav <dy627511@gmail.com>',
     to,
        subject,
        template: 'insertText',
        context: {
            userName
        }
    }

    config.sendMail(mailDetail, (err, msg) => {
        if (err) console.error(err);
        console.log('email sended sucessfully', msg);
    });
}

module.exports = {
    mailToUser
}
