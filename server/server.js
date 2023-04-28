import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';

import tourRoute from './routes/TourRoute.js';
import userRoute from './routes/userRoute.js';
import ErrorHandler from './utils/errorHandler.js';
import reviewRoute from './routes/ReviewRoute.js';
import { errorController } from './controllers/errorController.js';

dotenv.config({ path: './config.env' });

const server = express();
// * middlewares
// ! security
// ! limiting requests
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'too many requests from this IP, please try again in an hour',
});
server.use(helmet());
server.use('/api', limiter);

if (process.env.NODE_ENV == 'development') {
    server.use(morgan('dev'));
}

server.use(cors());
// ! body-parser for getting date from req.body
server.use(bodyParser.json({ limit: '10kb' }));

// * data sanitization against NoSQL query injection
server.use(mongoSanitize());
// * data sanitization against XSS
server.use(xss());
// * Prevent parameter pollution
server.use(
    hpp({
        whitelist: [
            'duration',
            'ratingsQuantity',
            'ratingsAverage',
            'maxGroupSize',
            'difficulty',
            'price',
        ],
    })
);

// * connection
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('db connected');
});
mongoose.Promise = global.Promise;
// * routes
server.use('/api/v1/tours', tourRoute);
server.use('/api/v1/users', userRoute);
server.use('/api/v1/reviews', reviewRoute);

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
