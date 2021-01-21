import express from 'express';
import userController from '../controllers/user.js';
import orderController from '../controllers/order.js';
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
router.get('/api/pendingproducts', asyncHandler(productController.pendingProducts));
router.get('/api/products/:id', asyncHandler(productController.getProduct));
router.post('/api/users/signin', userSignInValidate, userController.signIn);
router.post('/api/orders', orderController.addOrderItems);
router.post('/api/products', checkAuth.verifyUser, isSeller.verifySeller ,productController.createProduct);
router.put('/api/products/:id', checkAuth.verifyUser, isSeller.verifySeller, productController.updateProduct);
router.delete('/api/products/:id', checkAuth.verifyUser, isSeller.verifySeller, productController.deleteProduct);
router.put('/api/products/:id/approve', checkAuth.verifyUser, isAdmin.verifyAdmin, productController.approveProduct);
router.get('/api/users', checkAuth.verifyUser, isAdmin.verifyAdmin, userController.getUsers );
router.delete('/api/users/:id', checkAuth.verifyUser, isAdmin.verifyAdmin, userController.deleteUser );
router.get('/api/users/:id', checkAuth.verifyUser, isAdmin.verifyAdmin, userController.getUserById );
router.put('/api/profile', checkAuth.verifyUser, userController.updateUserProfile );
router.post('/api/products/:id/reviews', checkAuth.verifyUser, productController.reviewProduct );

export default router;