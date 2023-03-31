import Tour from '../models/TourModel.js';

export const getTours = async (req, res) => {
    try {
        const result = await Tour.find({});
        res.json(result);
    } catch (err) {
        console.log(err);
        res.status(501).send(null);
    }
};
