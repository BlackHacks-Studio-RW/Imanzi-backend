import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import crypto from 'crypto';
import Validator from '../utils/validator.js'
import Response from '../utils/Response.js'
const {config} = pkg;
import pkg from 'dotenv';
import MailSender from '../utils/mail.js'

const className = "Authentication";
class Authentication {
    /**
     * User Registration
     * @param {Object[]} req - Request
     * @param {Object[]} res - Response
     * @returns {Object[]} Response Object with its status
     */
    static async registration(req,res) {
        var {names, email ,password} = req.body;
        var { error } = Validator.validateRegister(req.body)
        
        if (error) {
            if (error.details) return Response.send400(res, error.details[0].message);
            else return Response.send400(res, error.message);
          }
      
          try {
            if (await User.findOne({ email })) {
              return Response.send409(res, "Email already exists");
            }
      
            password = bcrypt.hashSync(password, 10);
            var user = new User({
              names: names,
              email: email,
              password: password
            });
            await user.save();
            console.log("done")
            // await MailSender.registrationEmail(names, email);
      
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
                    //
                    const mailcredentials = {
                        from: "noreply@arti.rw",
                        to: email,
                        subject: "Welcome to Arti",
                        html: `Dear ${username} <br>,
                        Thank you for signing up to Arti's platform<br>.
                        Please click this button to <button><a href="http://localhost:4000/user/activate/${payload.user.id}"> activate </a></button>
                        `
                    }
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
          } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
        
 
        }
         /**
   * Delete User Profile
   * @param {Object[]} req - Request
   * @param {Object[]} res - Response
   * @returns {Object[]} Response Object with its status
   */
  static async profileDelete(req, res) {
    var { email } = req.body;
    try {
      await User.findOneAndRemove({ email: email });
      Response.send201(res, "Profile deleted successfully!", {});
    } catch (error) {
      Response.sendFailure(res, error, "Something went wrong", className);
    }
  }

  static async Delete (req, res) {
//     var { email } = req.body;
//     try {
//         user = await User.findOneAndRemove({ email: email })
//         if (user ==  null) {
//             return res.status(404).json({message: 'Cannot find user'})
//         }
//         // await res.user.remove()
//         // res.json({message: ' user Deleted'})

//     } catch(err) {
//         return res.status(500).json({message: err.message })
//     }
//     res.user = user
//     next()
  }
}

export default Authentication;