import express from 'express';

import {
    createReview,
    getAllReviews,
    deleteReview,
    updateReview,
    setTourUserIds,
} from '../controllers/reviewController.js';
import { protect, restrictTo } from '../controllers/authController.js';

// ! nesting these two routes
const reviewRoute = express.Router({ mergeParams: true });

//* this routes is available for also / and /:tourId/reviews
reviewRoute
    .route('/')
    .get(getAllReviews)
    .post(protect, restrictTo('user'), setTourUserIds, createReview);

reviewRoute
    .route('/:id')
    .delete(protect, restrictTo('admin'), deleteReview)
    .patch(updateReview);

export default reviewRoute;
