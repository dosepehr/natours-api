import express from 'express';
import { protect, restrictTo } from '../controllers/authController.js';
import {
    setBookingData,
    createBooking,
    myTours,
} from '../controllers/bookingController.js';
const bookingRoute = express.Router();

bookingRoute.get('/checkout/:tourId', protect, setBookingData, createBooking);
bookingRoute.get('/my-tours', protect, myTours);

export default bookingRoute;
