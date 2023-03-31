import express from 'express';
import { getTours } from '../controllers/tourController.js';

const tourRoute = express.Router();

// * Route --> http://localhost:5000/api/v1/tours
tourRoute.route('/').get(getTours)

export default tourRoute;
