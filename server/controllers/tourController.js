import Tour from '../models/TourModel.js';
import APIFeatures from '../utils/apiFeatures.js';

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
export const createTour = async (req, res) => {
    try {
        const result = await Tour.create(req.body);
        res.status(201).send(result);
    } catch (err) {
        console.log(err);
        res.status(501).send(null);
    }
};

// * updating tour

export const updateTour = async (req, res) => {
    try {
        const result = await Tour.findByIdAndUpdate(
            req.headers.authorization,
            req.body
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
