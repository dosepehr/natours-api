import express from 'express';

import {
    createReview,
    getAllReviews,
} from '../controllers/reviewController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const reviewRoute = express.Router({ mergeParams: true });

reviewRoute
    .route('/')
    .get(getAllReviews)
    .post(protect, restrictTo('user'), createReview);

export default reviewRoute;
