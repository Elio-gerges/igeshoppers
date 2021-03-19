//Importing libraries
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Creating Catalog schema
const catalogSchema = new mongoose.Schema(
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

//Apply the uniqueValidator plugin to catalogSchema.
catalogSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Catalog', catalogSchema);