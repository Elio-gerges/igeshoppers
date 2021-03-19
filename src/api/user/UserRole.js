//Importing libraries
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Creating User Roles schema
const userRoleSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            required: true
        },
        status: {
            type: Boolean,
            default: 1
        },
        date_created: {
            type: Date,
            default: Date.now
        },
    }
);

//Apply the uniqueValidator plugin to userRoleSchema.
userRoleSchema.plugin(uniqueValidator);

module.exports = mongoose.model('UserRole', userRoleSchema);