import express from 'express';
import asyncHandler from 'express-async-handler';
import orderController from '../controllers/order.js';
import productController from '../controllers/product.js';
import userController from '../controllers/user.js';
import checkAuth from '../middleware/checkAuth.js';
import isAdmin from '../middleware/isAdmin.js';
import isSeller from '../middleware/isSeller.js';
import { userSignInValidate } from '../validators/userSigninValidator.js';

const router = express.Router();
router.use(express.json());

router.get('/', (req, res) => res.send('Welcome Imanzi Website'));
router.get('/api/pendingproducts', asyncHandler(productController.pendingProducts));
/**
 * Orders
 */
router.post('/api/orders', orderController.addOrderItems);

/**
 * Users 
 */
router.post('/api/users/signin', userSignInValidate, userController.signIn);
router.get('/api/users', checkAuth.verifyUser, isAdmin.verifyAdmin, userController.getUsers );
router.delete('/api/users/:id', checkAuth.verifyUser, isAdmin.verifyAdmin, userController.deleteUser );
router.get('/api/users/:id', checkAuth.verifyUser, isAdmin.verifyAdmin, userController.getUserById );
router.put('/api/profile', checkAuth.verifyUser, userController.updateUserProfile );
/**
 * Products
 */
router.get('/api/products', asyncHandler(productController.getProducts));
router.get('/api/products/:id', asyncHandler(productController.getProduct));
router.post('/api/products', checkAuth.verifyUser, isSeller.verifySeller ,productController.createProduct);
router.put('/api/products/:id', checkAuth.verifyUser, isSeller.verifySeller, productController.updateProduct);

router.delete('/api/products/:id', checkAuth.verifyUser, isSeller.verifySeller, productController.deleteProduct);
router.put('/api/products/:id/approve', checkAuth.verifyUser, isAdmin.verifyAdmin, productController.approveProduct);
router.post('/api/products/:id/reviews', checkAuth.verifyUser, productController.reviewProduct );

export default router;