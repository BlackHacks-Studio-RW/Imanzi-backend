import nodemailer from 'nodemailer';
const {config} = pkg;
import pkg from 'dotenv';


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_SENDER,
        pass: process.env.MAIL_PASSWORD
    }
});

export default transporter;