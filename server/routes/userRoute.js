import express from 'express';
import { login, signup } from '../controllers/authController.js';

const userRoute = express.Router();

userRoute.route('/signup').post(signup);
userRoute.route('/login').post(login);

export default userRoute;
