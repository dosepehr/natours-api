import Tour from '../models/TourModel.js';

// * getting all tours
export const getTours = async (req, res) => {
    try {
        const result = await Tour.find({});
        res.status(201).send(result);
    } catch (err) {
        console.log(err);
        res.status(501).send(null);
    }
};

// * getting one user
export const getTour = async (req, res) => {
    try {
        const result = await Tour.findById(req.headers.authorization);
        res.status(201).json(result);
    } catch (err) {
        console.log(err);
        res.status(501).send(null);
    }
};




// * creating a new tour
export const createTour = async (req, res) => {
    try {
        const result = await Tour.create({
            name: req.body.name,
            rating: req.body.rating,
            price: req.body.price,
        });
        res.status(201).send(result);
    } catch (err) {
        console.log(err);
        res.status(501).send(null);
    }
};
