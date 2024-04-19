import nodemailer, { Transporter } from 'nodemailer';
import { configStore } from '../config/';

class MailService {
    private transporter: Transporter;

    constructor() {
        const mailConfig = {
            host: configStore.get('SMTP_HOST'),
            port: configStore.get('SMTP_PORT'),
            auth: {
                user: configStore.get('SMTP_USER'),
                pass: configStore.get('SMTP_PASS'),
            },
        };

        this.transporter = nodemailer.createTransport(mailConfig);
    }

    async sendMail(
        emailTo: string,
        subject: string,
        text?: string,
        html?: string,
    ) {
        try {
            await this.transporter.sendMail({
                from: configStore.get('SMTP_USER'),
                to: emailTo,
                subject,
                text: text || '',
                html: html || '',
            });
        } catch (error) {
            console.error(error);
            throw new Error('Error sending email');
        }
    }
}

export const mailService = new MailService();
