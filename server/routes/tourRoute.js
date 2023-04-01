import express from 'express';
import {
    createTour,
    getTour,
    getTours,
    updateTour,
} from '../controllers/tourController.js';

const tourRoute = express.Router();

// * Route --> http://localhost:5000/api/v1/tours
tourRoute.route('/').get(getTours).post(createTour).put(updateTour);

// * Route --> http://localhost:5000/api/v1/tours/main
tourRoute.route('/main').get(getTour);

export default tourRoute;
