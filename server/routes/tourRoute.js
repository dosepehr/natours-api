import express from 'express';

const tourRoute = express.Router();

tourRoute.route('/').get(()=>console.log('tours route'));

export default tourRoute;
