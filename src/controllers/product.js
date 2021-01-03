import Sequelize from 'sequelize';
import models from '../database/models';

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});
const { user, Product } = models;

class Product_ {
  async getProducts(req, res) {
    try {
      return models.product.findAll({

        include: [
          {
            model: models.review,
            as: 'reviews'
          },
          
        ],
        group: ['product.id']
      }).then((info) => {
        res.status(200).send(info);
      });
    } catch (error) {
      res.status(500).send(error);
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
      console.log(file);
      console.log(file.url);

      const saveProduct = await Product.create({
        userId: req.body.userId,
        name: req.body.name,
        image: file.url,
        category: req.body.category,
        description: req.body.description,
        price: req.body.price,
        countInStock: req.body.countInStock,
        status: req.body.status
      });

      return res.status(201).send({
        saveProduct,
        message:'Product created'
      })   
        
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }
}

export default new Product_();