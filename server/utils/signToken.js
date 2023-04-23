import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config({ path: './config.env' });

export const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};
