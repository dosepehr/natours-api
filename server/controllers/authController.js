import User from '../models/UserModel.js';
import { catchAsync } from '../utils/catchAsync.js';
import ErrorHandler from '../utils/errorHandler.js';
import { createSendToken } from '../utils/createSendToken.js';
import Email from '../utils/email.js';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

export const signup = catchAsync(async (req, res, next) => {
    const { name, email, password, confirmPassword, role } = req.body;
    const newUser = await User.create({
        name,
        email,
        password,
        confirmPassword,
        role,
    });
    new Email(newUser, `${req.protocol}://${req.get('host')}/me`).sendWelcome();

    createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    //  check if email and password are provided
    if (!email || !password) {
        return next(new ErrorHandler('please provide email and password', 400));
    }
    // getting user from db based on email and compare passwords

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new ErrorHandler('incorrect email or password', 401));
    }
    // if everything was ok,send the token
    createSendToken(user, 200, res);
});

export const protect = catchAsync(async (req, res, next) => {
    // getting token
    let token;
    if (
        req.headers.authorization &&
        req.hejwtaders.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
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
    try {
        const resetURL = `${req.protocol}://${req.get(
            'host'
        )}/api/v1/users/resetPassword/${resetToken}`;
        await new Email(user, resetURL).sendPasswordReset()
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

export const updatePassword = catchAsync(async (req, res, next) => {
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    // 2) Check if POSTed current password is correct
    if (
        !(await user.correctPassword(req.body.currentPassword, user.password))
    ) {
        return next(new ErrorHandler('Your current password is wrong.', 401));
    }

    // 3) If so, update password
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();
    // User.findByIdAndUpdate will NOT work

    // 4) Log user in, send JWT
    createSendToken(user, 200, res);
});

export const logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({
        status: 'success',
    });
};
