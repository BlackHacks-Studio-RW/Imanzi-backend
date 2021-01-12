
import express from 'express'
import Product from '../models/productModel.js'
import asyncHandler from 'express-async-handler'
// const cloudinary = require('cloudinary').v2;

// cloudinary.config({
//   cloud_name: process.env.cloud_name,
//   api_key: process.env.api_key,
//   api_secret: process.env.api_secret
// });

class Product_ {
  async getProducts(req, res) {
    try {
      const products = await Product.find({})

      res.status(200).send(products)
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async getProduct(req,res){
    try {
      const product = await Product.findById(req.params.id)
      if(product){
        res.send(product);
      }else{
        res.status(404).send({
          message: 'Product not found'
        })
      }
    } catch (error) {
      res.status(500)
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

export default new Product_();