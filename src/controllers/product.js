
import express from 'express'
import Product from '../models/productModel.js'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});

class Product_ {
  async getProducts(req, res) {
    try {
      
      const products = await Product.find({status:'approved'})
      
      res.status(200).send(products)
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async pendingProducts(req, res) {
    try {
      const products = await Product.find({status:'pending'})
      
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

  async createProduct(req, res) {
    try {
      // const user_ = await user.findOne({ where: { id } });
      // const role = user_.role;
      let files;
      if (req.files != null) {
        files = req.files.photo;
      }

      const file = await cloudinary.uploader.upload(files.tempFilePath);

      const product = new Product({
        name: req.body.name,
        image: file.url,
        user: req.user.id,
        category: req.body.category,
        description: req.body.description,
        price: req.body.price,
        countInStock: req.body.countInStock
      });

      const createdProduct = await product.save()

      res.status(201).send({
        createdProduct,
        message:'Product created'
      })   
        
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }

  async updateProduct(req,res){
    try {
      
      let files;
      if (req.files != null) {
        files = req.files.photo;
      }

      const file = await cloudinary.uploader.upload(files.tempFilePath);

      const newProduct = new Product({
        name: req.body.name,
        image: file.url,
        category: req.body.category,
        description: req.body.description,
        price: req.body.price,
        countInStock: req.body.countInStock
      });

      const product = await Product.findById(req.params.id)

      if (product) {
        if(req.user.id === product.user.toString()){
          product.name = newProduct.name
          product.price = newProduct.price
          product.description = newProduct.description
          product.image = newProduct.image
          product.category = newProduct.category
          product.countInStock = newProduct.countInStock

          const updatedProduct = await product.save()
          res.json(updatedProduct)
        }else{
          res.status(403).send({
            error: "User not authorized"
          })
        }
        
      } else {
        res.status(404)
        throw new Error('Product not found')
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
  async deleteProduct(req,res){
    try {
      const product = await Product.findById(req.params.id)
      if (product) {
        if(req.user.id === product.user.toString()){
          await product.remove()
          res.json({ message: 'Product removed' })
        }else{
          res.status(403).send({
            error: 'User not authorized'
          })
        }
        
      } else {
        res.status(404)
        throw new Error('Product not found')
      }
    } catch (error) {
      res.status(500).send(error)
    }
  }

  async approveProduct(req,res){
    try{
      const product = await Product.findById(req.params.id)
      if(product){
        if(req.body.status === 'declined'){
          product.status = 'declined'
          await product.save()
          res.status(200).send({
            status: 200,
            message: 'Product is declined'
          })
        }else if(req.body.status === 'approved'){
          product.status = 'approved',
          await product.save()
          res.status(200).send({
            status: 200,
            productStatus: product.status,
            message:'Product is approved'
          })
        }
      }else{
        res.status(401).send({
          status: 401,
          message: 'product does not exist'
        })
      }
    }catch(error){
      res.status(500).send(error)
    }
  }

  async reviewProduct(req,res){
    try {
      const {rating, comment} = req.body;

      const product = await Product.findById(req.params.id);

      if(product){
        const alreadyReviewed = product.reviews.find(
          (r) => r.user.toString() === req.user.id.toString()
        )
        if(alreadyReviewed){
          return res.status(400).send({
            status: 400,
            error: 'You already reviewed this product'
          })
        }

        const review = {
          name: req.user.first_name +' '+ req.user.last_name,
          rating: Number(rating),
          comment,
          user: req.user.id
        }

        product.reviews.push(review)

        product.numReviews = product.reviews.length

        product.rating = product.reviews.reduce((acc,item) => item.rating + acc, 0) / product.reviews.length

        await product.save()

        res.status(201).send({
          status: 201,
          message: 'Review added'
        })


      }else{
        res.status(404).send({
          status: 404,
          error: 'Product not found'
        })
      }
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  }

 }

export default new Product_();