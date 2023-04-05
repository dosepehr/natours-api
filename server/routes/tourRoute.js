import express from 'express';
import {
    createTour,
    deleteTour,
    getTour,
    getTours,
    topToursAlias,
    updateTour,
} from '../controllers/tourController.js';

const tourRoute = express.Router();

// * Route --> http://localhost:5000/api/v1/tours
tourRoute
    .route('/')
    .get(getTours)
    .post(createTour)
    .put(updateTour)
    .delete(deleteTour);

tourRoute.route('/top-tours').get(topToursAlias, getTours);

// * Route --> http://localhost:5000/api/v1/tours/main
tourRoute.route('/main').get(getTour);

export default tourRoute;
