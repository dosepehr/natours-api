import express from 'express';
import { overview, tour } from '../controllers/viewController.js';
const viewRoute = express.Router();

viewRoute.get('/', overview);
viewRoute.get('/tour/:slug', tour);

export default viewRoute;
