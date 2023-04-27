import User from '../models/UserModel.js';
import { catchAsync } from '../utils/catchAsync.js';
import ErrorHandler from '../utils/errorHandler.js';
import { createSendToken } from '../utils/createSendToken.js';
import { sendEmail } from '../utils/email.js';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import crypto from 'crypto';
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

    createSendToken(newUser, 201, res);
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
    createSendToken(user, 200, res);
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

export const forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on POSTed email
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return next(
            new ErrorHandler('There is no user with email address.', 404)
        );
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get(
        'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message,
        });

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!',
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(
            new ErrorHandler(
                'There was an error sending the email. Try again later!'
            ),
            500
        );
    }
});

export const resetPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        return next(new ErrorHandler('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    createSendToken(user, 200, res);
});

