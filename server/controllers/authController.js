import User from '../models/UserModel.js';
import { catchAsync } from '../utils/catchAsync.js';
import ErrorHandler from '../utils/errorHandler.js';
import { signToken } from '../utils/signToken.js';

export const signup = catchAsync(async (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body;
    const newUser = await User.create({
        name,
        email,
        password,
        confirmPassword,
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
