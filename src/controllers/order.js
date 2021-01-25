
import express from 'express'
import Order from '../models/orderModel.js';
import Product from "../models/productModel";

import asyncHandler from 'express-async-handler'
// const cloudinary = require('cloudinary').v2;

// cloudinary.config({
//   cloud_name: process.env.cloud_name,
//   api_key: process.env.api_key,
//   api_secret: process.env.api_secret
// });

class OrderCreator {
   
/**
 * 
 * @param {*} item 
 * @param {*} qty 
 */
static retrieveItem(item, qty){
  console.log("Item ", item);
 
  return Product.findOne({
    _id: item, 
    countInStock: {
      $gte: qty
    }
  })
  .then(resp=>{
  if(resp && resp._id !== undefined)
  return resp
  else
  throw new Error('Could not find the item in stock.')
  })
}


  /**
   * 
   * @param {*} req 
   * @param {*} res 
   */
  static async addOrderItems(req, res) {
      console.log("Logged in user: "+ req.user)
      const {item, qty} = req.body;

      OrderCreator.retrieveItem(item, qty)
      .then(itemRetrieved=>{
        
        // We add the item in order
      Order.findOneAndUpdate(
        {
          user: req.user.id,
          isPaid:false,
          startedChecout: false
        },
        {
          $push: {
            orderItems:{
              qty: qty,
              price: itemRetrieved.price,
              product: itemRetrieved._id
            }
          }
        },
        {
          upsert: true, 
          useFindAndModify: true
        })

      })
      .then(savedOrder=>{
        res.status(201).send(savedOrder)
      })
      .catch(err=>{
        console.log(err)
      res.status(500).send({message: err.message});

      })
  }

 }

export default OrderCreator;