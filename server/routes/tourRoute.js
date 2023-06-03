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
import { resizeTourImages, uploadTourPhotos } from '../utils/uploadImage.js';
const tourRoute = express.Router();

// ! nesting these two routes
tourRoute.use('/:tourId/reviews', reviewRoute);
tourRoute.route('/stats').get(getTourStats);
tourRoute
    .route('/')
    .get(getTours)
    .post(protect, restrictTo('admin', 'lead-guide'), createTour);

tourRoute
    .route('/:id')
    .patch(
        protect,
        restrictTo('admin', 'lead-guide'),
        uploadTourPhotos,
        resizeTourImages,
        updateTour
    )
    .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

tourRoute.route('/:id').get(getTour);
tourRoute.route('/top-tours').get(topToursAlias, getTours);
tourRoute
    .route('/monthly-plan/:year')
    .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

export default tourRoute;
