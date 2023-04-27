import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });
import { signToken } from './signToken.js';
export const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
};

//! this util function stands for this code below

// const token = signToken(newUser._id);
// res.status(201).json({
//     status: 'success',
//     token,
//     user: newUser,
// });
