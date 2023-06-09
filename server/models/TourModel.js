import mongoose from 'mongoose';
// import validator from 'validator';
import slugify from 'slugify';
const TourSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            maxLength: 80,
            minLength: 10,
            // ! validator library
            // validate: [validator.isAlpha, 'not alpha'],
        },
        slug: String,
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
            required: [true, 'this field is required'],
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: 'the value is not ok',
            },
        },
        ratingsAverage: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
            set: (val) => Math.round(val * 10) / 10,
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: true,
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function (val) {
                    return val < this.price;
                },
                message: "discount price can't be greater than price !",
            },
        },
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
            // ! not sending this data to the client
            select: false,
        },
        startDates: [Date],
        startLocation: {
            //GeoJSON
            type: {
                type: String,
                default: 'point',
                enum: ['point'],
            },
            coordinates: [Number],
            address: String,
            description: String,
        },
        locations: [
            {
                type: {
                    type: String,
                    default: 'point',
                    enum: ['point'],
                },
                coordinates: [Number],
                address: String,
                description: String,
                day: Number,
            },
        ],
        // guides: Array, this was for embedding
        guides: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);
TourSchema.index({ price: 1 });

// virtual property
TourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

// document middleware, runs before .save() and .create()
TourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});
TourSchema.pre(/^find/, function (next) {
    // this.find({ secretTour: { $ne: true } });
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt',
    });

    next();
});

// virtual populate
TourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id',
});

// ? what is the diffrence between guide and review population? why we did virtual population on reviews?
// * we populate guides in TourModel,so we access guides in get tour --- child refrencing,we store in parent(tour) its children(guide)
// * we populate tour in ReviewsModel,so we access tour in get review
// * but to get access to reviews in get tour,we need to use virtual population --- parent refrencing,we store in child(review) its parent(tour)

// ! modelling tour guides embedding
// TourSchema.pre('save', async function (next) {
//     const guidesPromises = this.guides.map(
//         async (id) => await User.findById(id)
//     );
//     this.guides = await Promise.all(guidesPromises);
//     next();
// });

let Tour = mongoose.model('Tour', TourSchema);

export default Tour;
