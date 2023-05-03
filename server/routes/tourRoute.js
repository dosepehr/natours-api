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
import reviewRoute from './reviewRoute.js';
const tourRoute = express.Router();

// ! nesting these two routes
tourRoute.use('/:tourId/reviews', reviewRoute);

// * Route --> http://localhost:5000/api/v1/tours
tourRoute
    .route('/')
    .get(getTours)
    .post(protect, restrictTo('admin', 'lead-guide'), createTour);

// * Route --> http://localhost:5000/api/v1/tours
tourRoute
    .route('/:id')
    .patch(protect, restrictTo('admin', 'lead-guide'), updateTour)
    .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

// * Route --> http://localhost:5000/api/v1/tours/main
tourRoute.route('/:id').get(getTour);

//  * Route --> http://localhost:5000/api/v1/tours/top-tours
tourRoute.route('/top-tours').get(topToursAlias, getTours);

// * Route --> http://localhost:5000/api/v1/tours/stats
tourRoute.route('/stats').get(getTourStats);

// * Route --> http://localhost:5000/api/v1/tours/monthly-plan/:year
tourRoute
    .route('/monthly-plan/:year')
    .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

export default tourRoute;
