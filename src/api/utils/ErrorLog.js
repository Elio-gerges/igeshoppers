//Importing libraries
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Creating ErrorLog schema
const errorSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        date_stamp: {
            type: Date,
            default: Date.now
        },
        ip_address: {
            type: String,
        }
    }
);

//Apply the uniqueValidator plugin to errorSchema.
errorSchema.plugin(uniqueValidator);

module.exports = mongoose.model('ErrorLog', errorSchema);