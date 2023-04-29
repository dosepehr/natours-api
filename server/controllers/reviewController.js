import Review from '../models/ReviewModel.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getAllReviews = catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const data = await Review.find(filter);
    res.status(200).json({
        status: 'success',
        length: data.length,
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
