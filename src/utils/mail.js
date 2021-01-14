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
        const payload = {
            user: {
                id: user.id
            }
        };
        jwt.sign(
            payload,
            "randomString", {
            expiresIn: 10000
        },
            (err, token) => {
                if (err) throw err;
                        
                const subject = "Welcome to Imanzi!";
                const content = `Dear ${names} <br>,
                Thank you for signing up to Imanzi's platform<br>.
                Please click this button to <button><a href="http://localhost:3000/user/activate/${payload.user.id}"> activate </a></button>
                `
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.MAIL_SENDER,
                        pass: process.env.MAIL_PASSWORD
                    }
                });
        const mail = {
          to: email,
          subject: subject,
          from: {
            email: senderEmail,
            name: senderName
          },
          html: content
        };
        
        transporter.sendMail(mail)
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