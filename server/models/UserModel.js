import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
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
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
});

UserSchema.methods.correctPassword = async function (
    enteredPassword,
    userPassword
) {
    return await bcrypt.compare(enteredPassword, userPassword);
};

let User = mongoose.model('Users', UserSchema);

export default User;
