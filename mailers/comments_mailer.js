const nodemailer = require('../config/nodemailer');

exports.newComment = (comment) => {

    let htmlString = nodemailer.renderTemplate(
        {comment: comment},
        '/comments/new_comments.ejs'
    );

    nodemailer.transporter.sendMail({
        from: "onlineclassesse113@gmail.com",
        to: comment.user.email,
        subject: "Comment Successfully Added",
        html: htmlString
    }, (err, info) => {
        if(err){
            console.log("MAIL SENDING ERROR")
            console.log(err);
            return;
        }
        // console.log("MAIL DELIVERED => ",info);
        return;
    });
};
