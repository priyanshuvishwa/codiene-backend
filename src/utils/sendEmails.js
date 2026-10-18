import nodemailer from "nodemailer";
import 'dotenv/config'

const transporter = nodemailer.createTransport({
    host: process.env.ZOHO_SMTP_HOST,
    port: Number(process.env.ZOHO_SMTP_PORT || 465),
    secure: Number(process.env.ZOHO_SMTP_PORT || 465) === 465,

    auth: {
        user: process.env.ZOHO_EMAIL,
        pass: process.env.ZOHO_APP_PASSWORD,
    },
});

const sendEmail = async ({ to, subject, text, replyTo }) => {
    return await transporter.sendMail({
        from: `"Codeine Tech" <${process.env.ZOHO_EMAIL}>`,
        to,
        subject,
        text,
        ...(replyTo && { replyTo }),
    });
};

export { sendEmail, transporter };