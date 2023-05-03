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
import {
    deleteMe,
    getUsers,
    updateMe,
    deleteUser,
    updateUser,
    getUser,
    getMe,
} from '../controllers/userController.js';

const userRoute = express.Router();

userRoute.route('/signup').post(signup);
userRoute.route('/login').post(login);

userRoute.route('/forgotPassword').post(forgotPassword);
userRoute.route('/resetPassword/:token').patch(resetPassword);
userRoute.route('/updatePassword').patch(protect, updatePassword);

userRoute.route('/updateMe').patch(protect, updateMe);
userRoute.route('/deleteMe').patch(protect, deleteMe);
userRoute.get('/me', protect, getMe, getUser);
userRoute.route('/').get(protect, restrictTo('admin', 'lead-guide'), getUsers);
userRoute
    .route('/:id')
    .delete(protect, restrictTo('admin'), deleteUser)
    .patch(updateUser)
    .get(getUser);

export default userRoute;
