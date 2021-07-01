const nodemailer = require('nodemailer')

module.exports = async function sendMail(toMail,header,content){
    let testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
        service:'gmail',
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, 
        auth: {
            user: testAccount.user, 
            pass: testAccount.pass, 
        },
    })

    const mailOptions = {
        from:testAccount.user,
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
