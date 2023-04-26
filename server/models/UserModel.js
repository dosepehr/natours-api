import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'please provide a valid email'],
    },
    photo: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user',
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 8,
        select: false,
    },
    confirmPassword: {
        type: String,
        required: true,
        trim: true,
        minLength: 8,

        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'passwords are not the same',
        },
    },
    passwordChangedAt: {
        type: Date,
        default: Date.now(),
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
});

UserSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

UserSchema.methods.correctPassword = async function (
    enteredPassword,
    userPassword
) {
    return await bcrypt.compare(enteredPassword, userPassword);
};

UserSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );

        return JWTTimestamp < changedTimestamp;
    }

    // False means NOT changed
    return false;
};

UserSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    console.log({ resetToken }, this.passwordResetToken);

    // ! number 10 is active time of the token
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

let User = mongoose.model('Users', UserSchema);

export default User;
