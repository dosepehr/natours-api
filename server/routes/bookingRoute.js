import express from 'express';
import { protect, restrictTo } from '../controllers/authController.js';
import {
    setBookingData,
    createBooking,
} from '../controllers/bookingController.js';
const bookingRoute = express.Router();

bookingRoute.get(
    '/checkout/:tourId',
    protect,
    setBookingData,
    createBooking
);

export default bookingRoute;
