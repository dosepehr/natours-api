import { catchAsync } from '../utils/catchAsync.js';
import ErrorHandler from '../utils/errorHandler.js';

export const deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);

        if (!doc) {
            return next(
                new ErrorHandler('No document found with that ID', 404)
            );
        }

        res.status(204).json({
            status: 'success',
            data: null,
        }); 
    });
