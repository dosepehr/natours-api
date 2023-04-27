import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import tourRoute from './routes/TourRoute.js';
import userRoute from './routes/userRoute.js';
import ErrorHandler from './utils/errorHandler.js';
import { errorController } from './controllers/errorController.js';

const server = express();
// * middlewares
dotenv.config({ path: './config.env' });
if (process.env.NODE_ENV == 'development') {
    server.use(morgan('dev'));
}
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'too many requests from this IP, please try again in an hour',
});
server.use('/api', limiter);
server.use(cors());
server.use(bodyParser.json());

// * connection
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('db connected');
});
mongoose.Promise = global.Promise;
// * routes
server.use('/api/v1/tours', tourRoute);
server.use('/api/v1/users', userRoute);

// * a route for undefined routes
server.all('*', (req, res, next) => {
    next(new ErrorHandler(`can't fint ${req.originalUrl} on this server`, 404));
});

server.use(errorController);

// * run server on port
const port = process.env.PORT || 5080;
server.listen(port, () => {
    console.log(`server running on port ${port}`);
});
