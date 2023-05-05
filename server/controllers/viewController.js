import Tour from '../models/TourModel.js';
import { catchAsync } from '../utils/catchAsync.js';
export const overview = catchAsync(async (req, res, next) => {
    // 1) get data from server
    const tours = await Tour.find();

    res.status(200).render('overview', {
        title: 'All tours',
        tours,
    });
});
export const tour = (req, res) => {
    res.status(200).render('tour', {
        title: 'All tours',
    });
};
