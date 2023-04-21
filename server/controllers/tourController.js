import Tour from '../models/TourModel.js';
import APIFeatures from '../utils/apiFeatures.js';
import { catchAsync } from '../utils/catchAsync.js';
// * alias for top tours

export const topToursAlias = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summery,difficulty';
    next();
};

// * getting all tours
export const getTours = async (req, res) => {
    try {
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limit()
            .paginate();

        const result = await features.query;

        res.status(200).send({ length: result.length, result });
    } catch (err) {
        console.log(err);
        res.status(501).send(null);
    }
};

// * getting one user
export const getTour = async (req, res) => {
    try {
        const result = await Tour.findById(req.headers.authorization);
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(501).send(null);
    }
};

// * creating a new tour
export const createTour = catchAsync(async (req, res) => {
    const result = await Tour.create(req.body);

    res.status(201).send(result);
});

// * updating tour

export const updateTour = async (req, res) => {
    try {
        const result = await Tour.findByIdAndUpdate(
            req.headers.authorization,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(501).send(null);
    }
};
// * deleting tour

export const deleteTour = async (req, res) => {
    try {
        const result = await Tour.findByIdAndDelete(req.headers.authorization);
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(501).send(null);
    }
};

export const getTourStats = async (req, res) => {
    try {
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
    } catch (err) {
        console.log(err);
        res.status(501).send(null);
    }
};

export const getMonthlyPlan = async (req, res) => {
    try {
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
    } catch (err) {
        console.log(err);
        res.status(501).send(null);
    }
};
