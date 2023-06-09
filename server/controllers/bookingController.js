import Tour from '../models/TourModel.js';
import { catchAsync } from '../utils/catchAsync.js';
import { createOne, getAll, getOne } from './handlerFactory.js';
import ErrorHandler from '../utils/errorHandler.js';
import Booking from '../models/BookingModel.js';

export const setBookingData = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.tourId);
    req.body.tour = tour.id;
    req.body.user = req.user.id;
    req.body.price = tour.price;

    next();
});

export const myTours = catchAsync(async (req, res, next) => {
    const bookings = await Booking.find({
        user: req.user.id,
    });
    const tourIDs = bookings.map((el) => el.tour);
    const tours = await Tour.find({ _id: { $in: tourIDs } });
    res.status(200).json({
        status: 'success',
        length: tours.length,
        data: tours,
    });
});

export const createBooking = createOne(Booking);
export const getBooking = getOne(Booking);
export const getAllBookings = getAll(Booking);
