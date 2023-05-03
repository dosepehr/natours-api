import Tour from '../models/TourModel.js';
import APIFeatures from '../utils/apiFeatures.js';
import { catchAsync } from '../utils/catchAsync.js';
import {
    deleteOne,
    updateOne,
    createOne,
    getOne,
    getAll,
} from './handlerFactory.js';

// * alias for top tours

export const topToursAlias = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summery,difficulty';
    next();
};

export const getTours = getAll(Tour);
export const getTour = getOne(Tour, { path: 'reviews' });
export const createTour = createOne(Tour);
export const updateTour = updateOne(Tour);
export const deleteTour = deleteOne(Tour);

export const getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: {
                //! select documents that match this condition
                ratingsAverage: {
                    $gte: 4.5,
                },
            },
        },
        {
            // !group data
            $group: {
                // ! group by what
                _id: null,
                // _id: '$difficulty',
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            },
        },
        {
            $sort: { avgPrice: 1 },
        },
        // {
        //     $match: { _id:{$ne:"easy"}}
        // }
    ]);
    res.status(201).send(stats);
});

export const getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = +req.params.year;

    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates',
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                },
            },
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tour: { $push: '$name' },
            },
        },
        {
            $addFields: { month: '$_id' },
        },
        {
            $project: {
                _id: 0,
            },
        },
        {
            $sort: { month: 1 },
        },
        // {
        //     $limit:2
        // }
    ]);

    res.status(201).send(plan);
});
