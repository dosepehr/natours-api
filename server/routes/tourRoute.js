import express from 'express';
import {
    createTour,
    deleteTour,
    getMonthlyPlan,
    getTour,
    getTours,
    getTourStats,
    topToursAlias,
    updateTour,
} from '../controllers/tourController.js';

import { protect, restrictTo } from '../controllers/authController.js';
import { createReview } from '../controllers/reviewController.js';
const tourRoute = express.Router();

// * Route --> http://localhost:5000/api/v1/tours
tourRoute.route('/').get(protect, getTours).post(createTour);

// * Route --> http://localhost:5000/api/v1/tours
tourRoute
    .route('/:id')
    .patch(updateTour)
    .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

// * Route --> http://localhost:5000/api/v1/tours/main
tourRoute.route('/main/:id').get(getTour);

//  * Route --> http://localhost:5000/api/v1/tours/top-tours
tourRoute.route('/top-tours').get(topToursAlias, getTours);

// * Route --> http://localhost:5000/api/v1/tours/stats
tourRoute.route('/stats').get(getTourStats);

// * Route --> http://localhost:5000/api/v1/tours/monthly-plan/:year
tourRoute.route('/monthly-plan/:year').get(getMonthlyPlan);

tourRoute
    .route('/:tourId/review')
    .post(protect, restrictTo('user'), createReview);

export default tourRoute;
