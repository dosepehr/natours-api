import Review from '../models/ReviewModel.js';
import {
    deleteOne,
    updateOne,
    createOne,
    getOne,
    getAll,
} from './handlerFactory.js';
import ErrorHandler from '../utils/errorHandler.js';
import { catchAsync } from '../utils/catchAsync.js';

export const setTourUserIds = (req, res, next) => {
    // allow nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
};

export const checkUser = catchAsync(async (req, res, next) => {
    const review = await Review.findById(req.params.id);
    if (!review) {
        return next(
            new ErrorHandler('This review does not exist any more!', 404)
        );
    }

    if (review.user.id === req.user.id) {
        next();
    } else {
        return next(new ErrorHandler("you can't edit this review!", 401));
    }
});

export const getAllReviews = getAll(Review);
export const getReview = getOne(Review);
export const createReview = createOne(Review);
export const updateReview = updateOne(Review);
export const deleteReview = deleteOne(Review);
