import Review from '../models/ReviewModel.js';
import { catchAsync } from '../utils/catchAsync.js';
import { deleteOne, updateOne, createOne } from './handlerFactory.js';

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

export const setTourUserIds = (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
};

export const checkUser = async (req, res, next) => {
    const review = await Review.findById(req.params.id);
    if (review.user.id === req.user.id) {
        next();
    } else {
        res.status(403).json({
            message: "you can't edit this review",
        });
    }
};

export const createReview = createOne(Review);
export const updateReview = updateOne(Review);
export const deleteReview = deleteOne(Review);
