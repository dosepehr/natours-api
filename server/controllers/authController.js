import User from '../models/UserModel.js';
import { catchAsync } from '../utils/catchAsync.js';
import ErrorHandler from '../utils/errorHandler.js';
import { signToken } from '../utils/signToken.js';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

export const signup = catchAsync(async (req, res, next) => {
    const { name, email, password, confirmPassword, role, passwordChangedAt } =
        req.body;
    const newUser = await User.create({
        name,
        email,
        password,
        confirmPassword,
        role,
        passwordChangedAt,
    });
    const token = signToken(newUser._id);
    res.status(201).json({
        status: 'success',
        token,
        user: newUser,
    });
});

export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    // ! check if email and password are provided
    if (!email || !password) {
        return next(new ErrorHandler('please provide email and password', 400));
    }
    // !getting user from db based on email and compare passwords

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new ErrorHandler('incorrect email or password', 401));
    }
    // ! if everything was ok,send the token
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token,
    });
});

export const protect = catchAsync(async (req, res, next) => {
    // getting token
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new ErrorHandler('you are not logged in!', 401));
    }
    // validating token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(
            new ErrorHandler(
                'the user belonging to this token does no longer exist',
                401
            )
        );
    }
    // Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new ErrorHandler(
                'User recently changed password! Please log in again.',
                401
            )
        );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
});

export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    'You do not have permission to perform this action',
                    403
                )
            );
        }

        next();
    };
};
