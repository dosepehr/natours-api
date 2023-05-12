import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import pug from 'pug';
import url from 'url';
dotenv.config({ path: './config.env' });

export default class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `sepehr do ${process.env.EMAIL_FROM}`;
    }
    newTransport() {
        if (process.env.NODE_ENV == 'production') {
            return nodemailer.createTransport({
                host: process.env.EMAIL_HOST_LIARA,
                port: process.env.EMAIL_PORT,
                tls: true,
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });
        }
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST_MAILTRAP,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }
    async send(template, subject) {
        const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
        // render html
        const html = pug.renderFile(
            `${__dirname}/../views/email/${template}.pug`,
            {
                firstName: this.firstName,
                url: this.url,
                subject,
            }
        );

        // define the email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            // text: options.message,
            html,
        };
        // create a transport and send email
        await this.newTransport().sendMail(mailOptions);
    }
    async sendWelcome() {
        await this.send('welcome', 'Welcome to the Natours Family!');
    }
    async sendPasswordReset() {
        await this.send(
            'passwordReset',
            'Your password reset token (valid for 10 minutes)'
        );
    }
}
