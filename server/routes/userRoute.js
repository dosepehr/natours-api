import express from 'express';
import {
    login,
    signup,
    forgotPassword,
    resetPassword,
} from '../controllers/authController.js';

const userRoute = express.Router();

userRoute.route('/signup').post(signup);
userRoute.route('/login').post(login);

userRoute.route('/forgotPassword').post(forgotPassword);
userRoute.route('/resetPassword').patch(resetPassword);

export default userRoute;
