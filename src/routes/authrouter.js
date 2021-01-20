import express from 'express';
import usercontroller from '../controllers/user.js';
import Authentication from '../controllers/auth.js';
import productController from '../controllers/product.js';
import { userSignInValidate } from '../validators/userSigninValidator.js';
import asyncHandler from 'express-async-handler';


const router = express.Router();
router.use(express.json());
router.post('/api/users/register', Authentication.registration);
router.delete('/api/users/delete', Authentication.profileDelete);
router.post('/api/users/signin', Authentication.LogIn);
router.get('/api/users/activate/:id/:code', Authentication.AccountActivation);
router.get('/api/users/profile', Authentication.profile);
router.post('/api/users/forgot', Authentication.forgotPassword);
router.post('/api/users/reset/:id/:token', Authentication.resetPassword);

export default router;

