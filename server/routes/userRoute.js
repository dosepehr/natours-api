import express from 'express';
import {
    login,
    signup,
    forgotPassword,
    resetPassword,
    updatePassword,
    protect,
    restrictTo,
} from '../controllers/authController.js';
import { deleteMe, getUsers, updateMe } from '../controllers/userController.js';

const userRoute = express.Router();

userRoute.route('/signup').post(signup);
userRoute.route('/login').post(login);

userRoute.route('/forgotPassword').post(forgotPassword);
userRoute.route('/resetPassword/:token').patch(resetPassword);
userRoute.route('/updatePassword').patch(protect, updatePassword);

userRoute.route('/updateMe').patch(protect, updateMe);
userRoute.route('/deleteMe').patch(protect, deleteMe);

userRoute.route('/').get(protect, restrictTo('admin', 'lead-guide'), getUsers);

export default userRoute;
