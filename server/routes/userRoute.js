import express from 'express';
import {
    login,
    signup,
    forgotPassword,
    resetPassword,
    updatePassword,
    protect,
} from '../controllers/authController.js';
import { updateMe } from '../controllers/userController.js';

const userRoute = express.Router();

userRoute.route('/signup').post(signup);
userRoute.route('/login').post(login);

userRoute.route('/forgotPassword').post(forgotPassword);
userRoute.route('/resetPassword/:token').patch(resetPassword);
userRoute.route('/updatePassword').patch(protect, updatePassword);

userRoute.route('/updateMe').patch(protect, updateMe);

export default userRoute;
