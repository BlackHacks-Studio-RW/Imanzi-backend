import express from 'express';
import usercontroller from '../controllers/user.js';
import productController from '../controllers/product.js';
import { userSignInValidate } from '../validators/userSigninValidator.js';
import asyncHandler from 'express-async-handler';

const router = express.Router();
router.use(express.json());

router.get('/', (req, res) => res.send('Welcome Imanzi Website'));
router.get('/api/products', asyncHandler(productController.getProducts));
router.get('/api/products/:id', asyncHandler(productController.getProduct));
router.post('/api/users/signin', userSignInValidate, usercontroller.signIn);
// router.post('/api/products',productController.createProduct);

export default router;