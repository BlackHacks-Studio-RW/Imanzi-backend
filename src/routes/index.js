import express from 'express';
import usercontroller from '../controllers/user.js';
import ordercontroller from '../controllers/order.js';
import productController from '../controllers/product.js';
import { userSignInValidate } from '../validators/userSigninValidator.js';
import asyncHandler from 'express-async-handler';
import isAdmin from '../middleware/isAdmin.js';
import isBuyer from '../middleware/isBuyer.js';
import isSeller from '../middleware/isSeller.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();
router.use(express.json());

router.get('/', (req, res) => res.send('Welcome Imanzi Website'));
router.get('/api/products', asyncHandler(productController.getProducts));
router.get('/api/products/:id', asyncHandler(productController.getProduct));
router.post('/api/users/signin', userSignInValidate, usercontroller.signIn);
router.post('/api/orders', ordercontroller.addOrderItems);
router.post('/api/products', checkAuth.verifyUser, isSeller.verifySeller ,productController.createProduct);
router.put('/api/products/:id', checkAuth.verifyUser, isSeller.verifySeller, productController.updateProduct);
router.delete('/api/products/:id', checkAuth.verifyUser, isSeller.verifySeller, productController.deleteProduct);

export default router;