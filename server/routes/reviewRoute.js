import express from 'express';

import {
    createReview,
    getAllReviews,
    deleteReview,
    updateReview,
    setTourUserIds,
    checkUser,
    getReview,
} from '../controllers/reviewController.js';
import { protect, restrictTo } from '../controllers/authController.js';

// ! nesting these two routes
const reviewRoute = express.Router({ mergeParams: true });

reviewRoute.use(protect);
//* this routes is available for also / and /:tourId/reviews
reviewRoute
    .route('/')
    .get(getAllReviews)
    .post(restrictTo('user'), setTourUserIds, createReview);

reviewRoute
    .route('/:id')
    .delete(restrictTo('admin', 'user'), deleteReview)
    .patch(restrictTo('admin', 'user'), checkUser, updateReview)
    .get(getReview);

export default reviewRoute;
