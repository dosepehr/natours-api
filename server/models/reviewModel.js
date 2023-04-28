import mongoose from 'mongoose';

const ReviewSchema = mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        tour: {
            type: mongoose.Schema.ObjectId,
            ref: 'tours',
            required: true,
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'users',
            required: true,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

let Review = mongoose.model('Reviews', ReviewSchema);

export default Review;
