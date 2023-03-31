import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import tourRoute from './routes/TourRoute.js';

const server = express();
// * middlewares
dotenv.config({ path: './config.env' });
server.use(morgan('dev'));
server.use(cors());
server.use(bodyParser.json());

// * connection
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('db connected');
});
mongoose.Promise = global.Promise;
// * routes
server.use('/api/v1/tours', tourRoute);


// * run server on port
const port = process.env.PORT || 5080;
server.listen(port, () => {
    console.log(`server running on port ${port}`);
});
