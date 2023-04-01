import mongoose from 'mongoose';

const TourSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    maxGroupSize: {
        type: Number,
        required: true,
    },
    difficulty: {
        type: String,
        required: true,
    },
    ratingsAverage: {
        type: Number,
        required: true,
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
    price: {
        type: String,
        required: true,
    },
    discount: Number,
    summary: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        required: true,
    },
    imageCover: {
        type: String,
        required: true,
    },
    images: [String],
    createdAT: {
        type: Date,
        default: Date.now(),
    },
    startDates: [Date],
});
let Tour = mongoose.model('Tours', TourSchema);

export default Tour;
