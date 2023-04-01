import express from 'express';
import { createTour, getTours } from '../controllers/tourController.js';

const tourRoute = express.Router();

// * Route --> http://localhost:5000/api/v1/tours
tourRoute.route('/').get(getTours).post(createTour)

export default tourRoute;
