//Importing libraries
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Creating Brand schema
const brandSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            required: true
        },
        status: {
            type: Boolean,
            required: true
        },
        created: {
            type: Date,
            default: new Date()
        }
    }
);

//Apply the uniqueValidator plugin to brandSchema.
brandSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Brand', brandSchema);