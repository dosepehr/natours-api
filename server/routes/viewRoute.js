import express from 'express';
import { overview, tour,getLoginForm } from '../controllers/viewController.js';
const viewRoute = express.Router();

viewRoute.get('/', overview);
viewRoute.get('/tour/:slug', tour);
viewRoute.get('/login', getLoginForm);

export default viewRoute;
