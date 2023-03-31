import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
const server = express();
dotenv.config({ path: './config.env' });

// * middlewares
server.use(morgan('dev'));
server.use(cors());
server.use(bodyParser.json());

// * connection
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('db connected');
});
mongoose.Promise = global.Promise;



const port = process.env.PORT || 5080;
server.listen(port, () => {
    console.log(`server runnging on port ${port}`);
});
