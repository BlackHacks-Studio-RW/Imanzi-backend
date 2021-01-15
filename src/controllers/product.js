
import express from 'express'
import Product from '../models/productModel.js'
import asyncHandler from 'express-async-handler'
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});

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
        product.name = newProduct.name
        product.price = newProduct.price
        product.description = newProduct.description
        product.image = newProduct.image
        product.category = newProduct.category
        product.countInStock = newProduct.countInStock

        const updatedProduct = await product.save()
        res.json(updatedProduct)
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
        await product.remove()
        res.json({ message: 'Product removed' })
      } else {
        res.status(404)
        throw new Error('Product not found')
      }
    } catch (error) {
      res.status(500).send(error)
    }
  }

 }

export default new Product_();