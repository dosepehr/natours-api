import express from 'express';

import {
    createReview,
    getAllReviews,
} from '../controllers/reviewController.js';
import { protect, restrictTo } from '../controllers/authController.js';

// ! nesting these two routes
const reviewRoute = express.Router({ mergeParams: true });

//* this routes is available for also / and /:tourId/reviews
reviewRoute
    .route('/')
    .get(getAllReviews)
    .post(protect, restrictTo('user'), createReview);

export default reviewRoute;