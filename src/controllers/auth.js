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
import transporter from '../utils/transporter.js'
import {comparePassword, hashPassword,jwtToken } from '../utils/jwToken.js';

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
            // const activationExpires = Date.now() + 360000; //1day
            password = bcrypt.hashSync(password, 10);
            var user = new User({
              name: name,
              email: email,
              password: password,
              ActivationCode: ActivationCode,
              // activationExpires: activationExpires
            });
            await user.save();
          const data = {
            from: `${process.env.MailSender}`,
            to: user.email,
            subject: "Welcome to Imanzi Creations",
            html: `Dear ${name} <br>,
            Thank you for signing up to Imanzi creations's platform<br>.
            Please click this button to <button><a href="http://localhost:3000/api/users/activate/${user.id}/${user.ActivationCode}/"> activate </a></button>
            `        };
            await transporter.sendMail(data);
            Response.send201(res, "User registered successfully!", {
              token: jwt.sign(
                {
                  email: user.email,
                  userType: user.userType
                },
                process.env.SECRET_OR_KEY
              ),
              user: {
                names: user.name,
                email: user.email
              }
            });
              
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
          res.sendStatus(401,"User does not exist");
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
              id: user.id,
              password: user.password,
             }
          })
      }
    }catch (error) {
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
    const { email } = req.body;
    try {
      await User.findOneAndRemove({ email: email });
      Response.send201(res, "Profile deleted successfully!", {});
    } catch (error) {
      Response.sendFailure(res, error, "Something went wrong", className);
    }
  }
    /**
   * User sign in or log in
   * @param {Object[]} req - Request
   * @param {Object[]} res - Response
   * @returns {Object[]} Response Object with its status
   */
  static async LogIn(req, res) {
    const { email, password } = req.body;
    const { error } = Validator.validateLogin(req.body);
    if (error) {
      if (error.details) return Response.send400(res, error.details[0].message);
      else return Response.send400(res, error.message);
    }

    try {
      var findUser = await User.findOne({ email });
      if (!findUser) {
        return Response.send409(res, "Invalid Email");
      }
      var canLogin = bcrypt.compare(password, findUser.password);
      if (!canLogin) {
        return Response.send409(res, "Invalid Password");
      }
      Response.send200(res, "User logged in successfully!", {
        token: jwt.sign(
          {
            email: findUser.email,
            userType: findUser.userType
          },
          process.env.SECRET_OR_KEY
        ),
        user: {
          names: findUser.names,
          email: findUser.email
        }
      });
              
            } catch (error) {
              Response.sendFailure(res, error, "Something went wrong", className);
          }
  }
  /**
   * View user profile
   * @param {Object[]} req - Request
   * @param {Object[]} res - Response
   * @returns {Object[]} Response Object with its status
   */
  static async profile(req, res) {
    const email = req.body.email;

    try {
      const user = await User.findOne({ email })
      if (user) {
        Response.send201(res,"User found successfully",{
          user: {
            name: user.name,
            email: user.email,
            isActive: user.isActive,
            id: user.passwordToken,
            password: user.password,
           }
        })
    
      } else {
        return Response.send409(res, "User doesnot exist");
      }
    } catch (error) {
      Response.sendFailure(res, error, "Something went wrong", className);
    }
  }
  /**
   * Forgot password 
   * @param {Object[]} req - Request
   * @param {Object[]} res - Response
   * @returns {Object[]} Response Object with its status
   */
  static async forgotPassword(req,res) {
    const { email } = req.body;
    const { error } = Validator.validateForgot(req.body);
    if (error) {
      if (error.details) return Response.send400(res, error.details[0].message);
      else return Response.send400(res, error.message);
    }

    try {
      var findUser = await User.findOne({ email });
      if (!findUser) {
        return Response.send409(res, "Invalid Email");
      }
      const passwordToken = crypto.randomBytes(20).toString("hex");
      const passwordExpires = Date.now() + 3600000; //1 Day
      const check = await User.findOneAndUpdate(
        { email: findUser.email },
        {
          passwordToken: passwordToken,
          passwordExpires: passwordExpires
        },
        { new: true }
      );
      const data = {
        from: `${process.env.MailSender}`,
        to: findUser.email,
        subject: "Forgot password",
        html: `Dear ${findUser.name} <br>,
        You have requested to reset your password <br>.
        Please click this button to <button><a href="http://localhost:3000/api/users/reset/${findUser.passwordToken}/"> to reset your password </a></button>
        `        };
        await transporter.sendMail(data);
        Response.send201(res, "Forgot password email sent successfully", {
          token: jwt.sign(
            {
              email: email,
              passwordToken: passwordToken
            },
            process.env.SECRET_OR_KEY
          ),
          user: {
            names: findUser.name,
            email: findUser.email
          }
        });
    } catch (error) {
      Response.sendFailure(res, error, className);
    }
  }
/**
   * Reset password 
   * @param {Object[]} req - Request
   * @param {Object[]} res - Response
   * @returns {Object[]} Response Object with its status
   */
  static async resetPassword(req,res) {
    let { email, password } = req.body;
    let { token } = req.params.token
    const { error } = Validator.validateReset(req.body);
    if (error) {
      if (error.details) return Response.send400(res, error.details[0].message);
      else return Response.send400(res, error.message);
    }

    try {
      var findUser = await User.findOne({ email });
      if (!findUser) {
        return Response.send409(res, "Invalid Email");
      }
      const validToken = await User.findOne({
        passwordToken: token,
        passwordExpires: { $gte: new Date().toISOString() }
      });
      if (!validToken) {
        return Response.send400(res, "Expired or Invalid Token");
      }

      password = bcrypt.hashSync(password, 10);
      const check = await User.findOneAndUpdate(
        { email: email },
        {
          password: password,
          passwordToken: null,
          passwordExpires: null
        },
        { new: true }
      );
      const data = {
        from: `${process.env.MailSender}`,
        to: findUser.email,
        subject: "Reset Password",
        html: `Dear ${findUser.name} <br>,
        Your password has been reset successfully <br>.
        Please click this button to <button><a href="http://localhost:3000/api/users/signin/"> to login to Imanzi creations' platform</a></button>
        `        };
        await transporter.sendMail(data);
        Response.send201(res, "Forgot password email sent successfully", {
          token: jwt.sign(
            {
              email: email,
              passwordToken: passwordToken
            },
            process.env.SECRET_OR_KEY
          ),
          user: {
            names: findUser.name,
            email: findUser.email
          }
        });
    } catch (error) {
      Response.sendFailure(res, error, className);
    }
  }
}
export default Authentication;