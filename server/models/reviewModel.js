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
            ref: 'Tour',
            required: [true, 'Review must belong to a tour.'],
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Review must belong to a user'],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

ReviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'tour',
        select: 'name',
    }).populate({
        path: 'user',
        select: 'name photo',
    });

    next();
});

let Review = mongoose.model('Review', ReviewSchema);

export default Review;
