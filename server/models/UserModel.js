import mongoose from 'mongoose';
import validator from 'validator';
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

let User = mongoose.model('Users', UserSchema);

export default User;
