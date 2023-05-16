import mongoose from 'mongoose';
import Tour from './TourModel.js';
const ReviewSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, 'Review can not be empty!'],
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
        createdAt: {
            type: Date,
            default: Date.now,
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

// each user one review on a tour
ReviewSchema.index({ tour: 1, user: 1 }, { unique: true });

ReviewSchema.pre(/^find/, function (next) {
    // this.populate({
    //   path: 'tour',
    //   select: 'name'
    // }).populate({
    //   path: 'user',
    //   select: 'name photo'
    // });

    this.populate({
        path: 'user',
        select: 'name photo',
    });
    next();
});

ReviewSchema.post('save', function () {
    this.constructor.calcAverageRatings(this.tour);
});
// calculate ratings avg and quantity whe a review has been updated or deleted
ReviewSchema.post(/^findOneAnd/, async function (doc) {
    if (doc) {
        await doc.constructor.calcAverageRatings(doc.tour);
    }
});

ReviewSchema.statics.calcAverageRatings = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId },
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' },
            },
        },
    ]);
    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating,
        });
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5,
        });
    }
};

const Review = mongoose.model('Review', ReviewSchema);

export default Review;
