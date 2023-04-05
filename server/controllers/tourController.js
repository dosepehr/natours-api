import Tour from '../models/TourModel.js';

// * getting all tours
export const getTours = async (req, res) => {
    try {
        // * 1) simple filtering
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach((el) => delete queryObj[el]);

        // * 2) advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        );
        let query = Tour.find(JSON.parse(queryStr));

        // * 3) sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // * 4) fields limiting
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }

        // * 5) pagination
        const page = +req.query.page || 1;
        const limit = +req.query.limit || 100;
        const skip = (page - 1) * limit;
         
        query = query.skip(skip).limit(limit);

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
