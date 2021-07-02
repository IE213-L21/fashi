const nodemailer = require('nodemailer')

module.exports = function sendMail(toMail,header,content){
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
        user: 'babyking1st14@gmail.com', // generated ethereal user
        pass: 'dangngocquang', // generated ethereal password
        },
    })

    const mailOptions = {
        from:'babyking1st14@gmail.com',
        to:toMail,
        subject:header,
        html:content
    }

    console.log(content)
    transporter.sendMail(mailOptions,function(err,info){
        if(err){
            console.log(err)
        }else{
            console.log('Email sent:' + info.response);
        }
    })
}
