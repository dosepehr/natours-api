import User from '../models/UserModel.js';
import {catchAsync} from '../utils/catchAsync.js';


export const signup = catchAsync(async (req, res) => {
    const newUser = User.create(req.body);
    res.status(201).json({
        status: 'success',
        user: newUser,
    });
});
