import mongoose from 'mongoose';
import validator from 'validator';
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
});
let Tour = mongoose.model('Tours', TourSchema);

export default Tour;
