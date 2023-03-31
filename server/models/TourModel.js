import mongoose from 'mongoose';

const TourSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 255,
    },
    rating: {
        type: Number,
        required: true,
        maxLength: 100,
    },
    price: {
        type: String,
        required: true,
        maxLength: 255,
    },
});

let Tour = mongoose.model('Tours', TourSchema);

export default Tour;
