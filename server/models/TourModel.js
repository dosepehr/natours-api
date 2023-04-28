import mongoose from 'mongoose';
// import validator from 'validator';
const TourSchema = mongoose.Schema({
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
            ref: 'Users', //name in the db
        },
    ],
});

TourSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt',
    });

    next();
});

// ! modelling tour guides embedding
// TourSchema.pre('save', async function (next) {
//     const guidesPromises = this.guides.map(
//         async (id) => await User.findById(id)
//     );
//     this.guides = await Promise.all(guidesPromises);
//     next();
// });

let Tour = mongoose.model('Tours', TourSchema);

export default Tour;
