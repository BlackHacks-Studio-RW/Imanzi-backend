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
import {comparePassword, hashPassword,jwtToken } from '../utils/jwToken.js';
import transporter from '../utils/transporter.js'
const className = "Authentication";
class Authentication {
    /**
     * User Registration
     * @param {Object[]} req - Request
     * @param {Object[]} res - Response
     * @returns {Object[]} Response Object with its status
     */
    static async registration(req,res) {
        var {name, email ,password} = req.body;
        var { error } = Validator.validateRegister(req.body)
        
        if (error) {
            if (error.details) return Response.send400(res, error.details[0].message);
            else return Response.send400(res, error.message);
          }
      
          try {
            if (await User.findOne({ email })) {
              return Response.send409(res, "Email already exists");
            }
            const ActivationCode = crypto.randomBytes(20).toString('hex');
            const activationExpires = Date.now() + 360000; //1day
            password = bcrypt.hashSync(password, 10);
            var user = new User({
              name: name,
              email: email,
              password: password,
              ActivationCode: ActivationCode,
              activationExpires: activationExpires
            });
            await user.save();
            console.log("done")
            const token = jwt.sign(
              {
                  userId: user._id
                  
              },
              process.env.SECRET_OR_KEY,
              {
                  expiresIn: 60 * 60 * 24 * 14,
              }
          );

          const data = {
            from: `${process.env.MailSender}`,
            to: user.email,
            subject: "Welcome to Imanzi Creations",
            html: `Dear ${name} <br>,
            Thank you for signing up to Imanzi creations's platform<br>.
            Please click this button to <button><a href="http://localhost:3000/api/users/activate/${user.id}/${user.ActivationCode}/"> activate </a></button>
            `        };
        await transporter.sendMail(data);
            Response.send201(res,{
              user: {
                name: user.name,
                email: user.email,
                ActivationCode: user.ActivationCode,
                id: user.id,
                isActive: user.isActive,             
               }
            })
          
          } catch (error) {
            Response.sendFailure(res, error, "Something went wrong", className);
        }
        
 
        }

          /**
   * Activation of user account
   * @param {Object[]} req - Request
   * @param {Object[]} res - Response
   * @returns {Object[]} Response Object with its status
   */
  static async AccountActivation(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
          res.sendStatus(401);
      } else {
          await User.updateOne(
              { ActivationCode: req.params.code },
              { isActive: true }
          );
          Response.send201(res,"Account activated successfully",{
            user: {
              name: user.name,
              email: user.email,
              isActive: user.isActive,
              id: user.id             
             }
          })
      }
  } catch (err) {
      console.log(
          "something went wrong",
          err
      );
      res.sendStatus(500);
  }
    //   console.log("i am here")
    // try {
    //   const user = await User.findOne({
    //     id: req.params,
    //     ActivationCode: req.params.code,
    //   });
    //   if (!user) {
    //     res.sendStatus(401,"user does not exist");

    // } else {
    //   await User.updateOne(
    //     { email: user.email },
    //     { isActive: true }
    // );
    // }
    
    // Response.send201(res,"Account activated successfully",{
    //   user: {
    //     name: user.name,
    //     email: user.email,
    //     status: user.status,
    //     id: user.id             
    //    }
    // })
               
    // }catch (error) {
    //   Response.sendFailure(res, error, "Something went wrong", className);
    // }
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
  static async signIn(req, res) {
    
  }
}

export default Authentication;