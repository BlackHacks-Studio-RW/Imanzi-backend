import express from 'express';
import usercontroller from '../controllers/user.js';
import productController from '../controllers/product.js';
import { userSignInValidate } from '../validators/userSigninValidator';

const router = express.Router();
router.use(express.json());

router.get('/', (req, res) => res.send('Welcome Imanzi Website'));
router.post('/api/users/signin', userSignInValidate, usercontroller.signIn);
router.post('/api/products',productController.createProduct);

export default router;