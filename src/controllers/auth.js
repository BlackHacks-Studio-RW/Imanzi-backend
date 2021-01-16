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
            // email sending
            // await MailSender.registrationEmail(names, email);
            Response.send201(res, "User registered successfully!", {
              token: jwt.sign(
                {
                  email: user.email,
                },
                process.env.SECRET_OR_KEY
              ),
              user: {
                names: user.names,
                email: user.email
              }
            });
          } catch (err) {
            Response.sendFailure(res, error, "Something went wrong", className);
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
}

export default Authentication;