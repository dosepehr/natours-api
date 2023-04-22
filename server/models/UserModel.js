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
        validator: [validator.isEmail, 'please provide a valid email'],
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
    },
});

let User = mongoose.model('Users', UserSchema);

export default User;
