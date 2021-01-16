import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
const {config} = pkg;
import pkg from 'dotenv';

const className = "MailSender";
class MailSender {
    /**
     * Email Sending
     
     */
    static async registrationEmail(names,email) {
        jwt.sign(
            "randomString", {
            expiresIn: 10000
        },
            (err, token) => {
                if (err) throw err;
                        
                const mailcredentials = {
                    from: "mjones6944@gmail.com",
                    to: email,
                    subject: "Welcome to Imanzi Creations",
                    html: `Dear ${names} <br>,
                    Thank you for signing up to Imanzi creations's platform<br>.
                    Please click this button to <button><a href="http://localhost:4000/user/activate/${token}"> activate </a></button>
                    `
                }
                const transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: 'mjones6944@gmail.com',
                        pass: '2015s3red'
                    }
                });
                    
                    transporter.sendMail(mailcredentials)
                    .then(resp=>{
                        console.log('email sent')
                    })
                    .catch(err=>{
                        console.log(err)
                    })
                    //
                    res.status(200).json({
                        token
                    });
    }
);
      }
    }


export default MailSender;