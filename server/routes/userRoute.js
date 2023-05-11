import express from 'express';
import {
    login,
    signup,
    forgotPassword,
    resetPassword,
    updatePassword,
    protect,
    restrictTo,
    logout,
} from '../controllers/authController.js';
import {
    deleteMe,
    getUsers,
    updateMe,
    deleteUser,
    updateUser,
    getUser,
    getMe,
} from '../controllers/userController.js';

import { uploadUserPhoto, resizeUserPhoto } from '../utils/uploadImage.js';

const userRoute = express.Router();

userRoute.route('/signup').post(signup);
userRoute.route('/login').post(login);
userRoute.route('/logout').get(logout);
userRoute.route('/forgotPassword').post(forgotPassword);
userRoute.route('/resetPassword/:token').patch(resetPassword);

userRoute.use(protect);
userRoute.route('/updatePassword').patch(updatePassword);

userRoute.route('/updateMe').patch(uploadUserPhoto, resizeUserPhoto, updateMe);
userRoute.route('/deleteMe').patch(deleteMe);
userRoute.get('/me', getMe, getUser);

userRoute.use(restrictTo('admin'));

userRoute.route('/').get(restrictTo('admin', 'lead-guide'), getUsers);
userRoute
    .route('/:id')
    .delete(restrictTo('admin'), deleteUser)
    .patch(updateUser)
    .get(getUser);

export default userRoute;
