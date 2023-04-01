import Tour from '../models/TourModel.js';

// * getting all tours
export const getTours = async (req, res) => {
    try {
        // ! a hard copy of req.query
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];

        // ! deleting those fields from req.query
        excludedFields.forEach((el) => delete queryObj[el]);

        // * advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        );
        const query = Tour.find(JSON.parse(queryStr));

        const result = await query;

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
