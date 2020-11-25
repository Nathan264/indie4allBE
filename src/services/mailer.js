const nodemailer = require('nodemailer');

module.exports = {
    async sendConfirmation(email, username, token) {
        const testAccount = await nodemailer.createTestAccount();;

        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });

        const info = await transporter.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>', 
            to: email,
            subject: "Token indie4all", 
            html: `<a href=https://indie4allbe.herokuapp.com/verifyAccount/?username=${username}&email=${email}&token=${token}>Liberar conta</a>`,
        });
        return nodemailer.getTestMessageUrl(info);
    },

    async recoverPwdMail(email, username, token) {
        const testAccount = await nodemailer.createTestAccount();;

        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });

        const mail = await transporter.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>', 
            to: email,
            subject: "Token indie4all", 
            html: `<a href=https://indie4allbe.herokuapp.com/pwdRecovery/?username=${username}&email=${email}&token=${token}>Mudar Senha</a>`,
        });
        return nodemailer.getTestMessageUrl(mail);
    }
}
