
import express from 'express'
import User from '../models/userModel.js'
import {comparePassword, hashPassword,jwtToken } from '../utils/jwToken.js';

export default class Users {
  
  static async signIn(req, res) {
    try {
      const { email, password } = req.body;
      const user_ = await User.findOne({ email  });
      if (!user_) return res.status(400).send({ status: 400, error: `User ${email} doesn't exist` });
      if (user_ && comparePassword(password, user_.password)) {
        const token = jwtToken.createToken(user_);
        
        return res.status(200).send({ token }); 
      }
      return res.status(400).send({ status: 400, error: 'invalid email/password combination ' });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }

  static async getUsers(req,res){
    try {
      const users = await User.find({});
      res.status(200).send(users
      )
    } catch (error) {
      res.status(500).send({
        error: error
      })
    }
  }
  static async updateUserProfile(req,res){
    try {
      const user = await User.findById(req.params._id);
      if(user){
        user.first_name = req.body.first_name || user.first_name
        user.last_name = req.body.last_name || user.last_name
        user.email = req.body.email || user.email
        if (req.body.password) {
          user.password = req.body.password
        }

        const updatedUser = await user.save()

        res.status(201).send({
          status: 201,
          updatedUser: updatedUser
        })
      }else{
        res.status(404).send({
          error: 'User Profile not found'
        })
      }
      
    } catch (error) {
      res.status(500).send({
        error: error
      })
    }
  }

  static async getUserById(req,res){
    try {
      const user = await User.findById(req.params.id).select('-password');
      if(!user){
        res.status(404).send({
          status:404,
          error: 'User was not found'
        })
      }
      res.status(200).send(user
      )
    } catch (error) {
      res.status(500).send({
        error: error
      })
    }
  }

  static async deleteUser(req,res){
    try {
      const user = await User.findById(req.params.id)
      if(!user){
        res.status(404).send({
          status: 404,
          error: 'user not found'
        })
      }
      user.remove()
      res.status(200).send({
        status: 200,
        error: 'User deleted'
      })
    } catch (error) {
      res.status(500).send(error)
    }
  }
}