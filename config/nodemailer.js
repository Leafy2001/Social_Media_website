const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'onlineclassesse113@gmail.com', // generated ethereal user
        pass: 'DELL@17830' // generated ethereal password
    }
    ,
    tls: {
        rejectUnauthorized: false
    }
});

let renderTemplate = (data, relativePath) => {
    let emailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err, template) {
            if(err){
                console.log(err);
                return;
            }
            emailHTML = template;
        }
    );

    return emailHTML;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
};