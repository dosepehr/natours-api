import Review from '../models/ReviewModel.js';
import ErrorHandler from '../utils/errorHandler.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getAllReviews = catchAsync(async (req, res, next) => {
    const data = await Review.find();
    res.status(200).json({
        status: 'success',
        data,
    });
});

export const createReview = catchAsync(async (req, res, next) => {
    // Allow nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    const newReview = await Review.create(req.body);
    res.status(201).json({
        status: 'success',
        data: newReview,
    });
});
