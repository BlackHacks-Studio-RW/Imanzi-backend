
import express from 'express'
import Order from '../models/orderModel.js'
import asyncHandler from 'express-async-handler'
// const cloudinary = require('cloudinary').v2;

// cloudinary.config({
//   cloud_name: process.env.cloud_name,
//   api_key: process.env.api_key,
//   api_secret: process.env.api_secret
// });

class Order_ {
  async addOrderItems(req, res) {

    try {
      const {orderItems, paymentMethod, itemsPrice, totalPrice} = req.body;
      if(orderItems && orderItems.length === 0){
        res.status(400).send({
          message: 'Bad request'
        })
      }else{
        const order = new Order({
          orderItems, 
          // user: req.user._id,
          paymentMethod, 
          itemsPrice, 
          totalPrice
        })

        const createdOrder = await order.save()
        res.status(201).send(createdOrder)
      }

    } catch (error) {
      res.status(500).send(error);
    }
  }


//   async createProduct(req, res) {
//     try {
//       // const user_ = await user.findOne({ where: { id } });
//       // const role = user_.role;
//       let files;
//       if (req.files != null) {
//         files = req.files.photo;
//       }

//       const file = await cloudinary.uploader.upload(files.tempFilePath);
//       console.log(file);
//       console.log(file.url);

//       const saveProduct = await Product.create({
//         userId: req.body.userId,
//         name: req.body.name,
//         image: file.url,
//         category: req.body.category,
//         description: req.body.description,
//         price: req.body.price,
//         countInStock: req.body.countInStock,
//         status: req.body.status
//       });

//       return res.status(201).send({
//         saveProduct,
//         message:'Product created'
//       })   
        
//     } catch (error) {
//       console.log(error);
//       return res.status(500).send(error);
//     }
//   }
 }

export default new Order_();