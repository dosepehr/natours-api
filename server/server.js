import express from 'express';
import * as url from 'url';
import path from 'path';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import tourRoute from './routes/tourRoute.js';
import userRoute from './routes/userRoute.js';
import ErrorHandler from './utils/errorHandler.js';
import reviewRoute from './routes/reviewRoute.js';
import bookingRoute from './routes/bookingRoute.js';
import viewRoute from './routes/viewRoute.js';
import { errorController } from './controllers/errorController.js';

dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
    console.log(err.name, err.message);
    console.log('UNCAUGHT REJECTION');
    process.exit(1);
});

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// security
// limiting requests
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'too many requests from this IP, please try again in an hour',
});
app.use(helmet());
app.use('/api', limiter);

if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'));
}

app.use(cors());
app.use(bodyParser.json({ limit: '10kb' }));
app.use(cookieParser());

// data sanitization against NoSQL query injection
app.use(mongoSanitize());
// data sanitization against XSS
app.use(xss());
// Prevent parameter pollution
app.use(
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

// connection
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log('db connected');
    })
    .catch('error in db');
mongoose.Promise = global.Promise;
// routes
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/reviews', reviewRoute);
app.use('/api/v1/booking', bookingRoute);
app.use('/', viewRoute);

// a route for undefined routes
app.all('*', (req, res, next) => {
    next(new ErrorHandler(`can't find ${req.originalUrl} on this app`, 404));
});

app.use(errorController);

// run app on port
const port = process.env.PORT || 5080;
const server = app.listen(port, () => {
    console.log(`app running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION');
    server.close(() => {
        process.exit(1);
    });
});
