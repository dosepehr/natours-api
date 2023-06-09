import User from '../models/UserModel.js';
import ErrorHandler from '../utils/errorHandler.js';
import { catchAsync } from '../utils/catchAsync.js';
import { filterObj } from '../utils/filterObj.js';
import { deleteOne, getOne, updateOne, getAll } from './handlerFactory.js';

export const updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new ErrorHandler(
                'This route is not for password updates. Please use /updatePassword.',
                400
            )
        );
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');
    if (req.file) filteredBody.photo = req.file.filename;
    
    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        filteredBody,
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser,
        },
    });
});

export const deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(204).json({
        status: 'success',
    });
});

export const getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

export const getUsers = getAll(User);
// Do NOT update password with this!
export const updateUser = updateOne(User);
export const getUser = getOne(User);
export const deleteUser = deleteOne(User);
