//Importing libraries
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Creating User schema
const userSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true,
            min: 5,
            unique: true,
            max: 255
        },
        password: {
            type: String,
            required: true,
            min: 5,
            max: 255
        },
        email: {
            type: String,
            required: true,
            min: 5,
            unique: true,
            max: 255
        },
        mobile: {
            type: String,
            required: true,
            min: 5,
            max: 255
        },
        picture: {
            type: String,
            required: true,
        },
        status: {
            type: Boolean,
            default: 1
        },
        roleId: {
            type: String,
            required: true,
        },
        date_created: {
            type: Date,
            default: Date.now
        },
        date_last_modified: {
            type: Date,
            default: Date.now
        },
    }
);

//Apply the uniqueValidator plugin to userSchema.
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);