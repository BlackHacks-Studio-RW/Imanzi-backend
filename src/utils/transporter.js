import nodemailer from 'nodemailer';
const {config} = pkg;
import pkg from 'dotenv';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'mjones6944@gmail.com',
        pass: '2015s3red'
    }
});

export default transporter;