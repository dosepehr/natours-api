import Tour from '../models/TourModel.js';
import APIFeatures from '../utils/apiFeatures.js';
import ErrorHandler from '../utils/errorHandler.js';
import { catchAsync } from '../utils/catchAsync.js';
import { deleteOne, updateOne,createOne } from './handlerFactory.js';

// * alias for top tours

export const topToursAlias = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summery,difficulty';
    next();
};

// * getting all tours
export const getTours = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limit()
        .paginate();

    const result = await features.query;

    res.status(200).send({ length: result.length, result });
});

// * getting one user
export const getTour = catchAsync(async (req, res, next) => {
    const result = await Tour.findById(req.params.id).populate('reviews');

    if (!result) {
        return next(new ErrorHandler('no', 404));
    }

    res.status(200).send(result);
});

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
