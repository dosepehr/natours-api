import mongoose from 'mongoose';

const BookingSchema = mongoose.Schema(
    {
        tour: {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour',
            required: true,
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        paid: {
            type: Boolean,
            default: true,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

BookingSchema.pre(/^find/, function (next) {
    this.populate('user').populate({
        path: 'tour',
        select: 'name',
    });

    next();
});

let Booking = mongoose.model('Booking', BookingSchema);
export default Booking;
