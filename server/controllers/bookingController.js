import Tour from '../models/TourModel.js';
import { catchAsync } from '../utils/catchAsync.js';
import { createOne } from './handlerFactory.js';
import ErrorHandler from '../utils/errorHandler.js';
import Booking from '../models/BookingModel.js';


export const setBookingData = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.tourId);
    req.body.tour = tour.id;
    req.body.user = req.user.id;
    req.body.price = tour.price;

    next();
});

export const createBooking = createOne(Booking);
