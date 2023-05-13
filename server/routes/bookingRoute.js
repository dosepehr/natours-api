import express from 'express';
import { protect, restrictTo } from '../controllers/authController.js';
import {
    setBookingData,
    createBooking,
    myTours,
    getAllBookings,
    getBooking,
} from '../controllers/bookingController.js';
const bookingRoute = express.Router();
bookingRoute.use(protect);
bookingRoute.get('/checkout/:tourId', setBookingData, createBooking);
bookingRoute.get('/my-tours', myTours);

bookingRoute.use(restrictTo('admin', 'lead-guide'));
bookingRoute.get('/', getAllBookings);
bookingRoute.get('/:id', getBooking);

export default bookingRoute;
