
import express from 'express'
import Order from '../models/orderModel.js';
import Product from "../models/productModel";

class OrderCreator {
   
  async addOrderItems(req, res){
    try {      
      const item = req.body.item
      const qty = req.body.qty
      // const userId = req.user.id
      const product = await Product.findOne({
        _id:item
      })
      
      if(product){
        if(product.countInStock >= req.body.qty){
        const order = await Order.updateOne(
        {
          user: req.user.id,
          isPaid:false,
          startedCheckout: false
        },
        {
          $push: {
            orderItems:{
              qty: qty,
              price: product.price,
              product: product._id
            }
          }
        },
        {
          upsert: true, 
          useFindAndModify: true
        })
        console.log(order)
        res.status(201).send({
          order: order,
          message: 'order modified'
          })
          
        }else{
          res.status(400).send({
            message:'few products in the stock'
          })
        }
      }else{
        res.status(404).send({
          message: 'Product does not exist'
        })
      }
      
    } catch (error) {
      console.log(error)
      res.status(500).send(error);
    }
  }

  async getOrderById(req,res){
    try {
      const order = await Order.findById(req.params.id).populate('user','id first_name last_name email')

      if(order){
        res.status(200).send(order)
      }else{
        res.status(404).send({
          message: 'Order not found'
        })
      }
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  }

  

  // @desc    Get logged in user orders
  // @route   GET /api/orders/myorders
  // @access  Private
  async getMyOrders(req,res){
    const orders = await Order.find({ user: req.user._id })
    res.json(orders)
  }


  // @desc    Get all orders
  // @route   GET /api/orders
  // @access  Private/Admin
  async getOrders(req,res){
    const orders = await Order.find({}).populate('user', 'id first_name last_name email')
    res.json(orders)
  }

 }

export default new OrderCreator;