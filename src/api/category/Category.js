//Importing libraries
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Creating Categories schema
const categoriesSchema = new mongoose.Schema(
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

//Apply the uniqueValidator plugin to categoriesSchema.
categoriesSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Category', categoriesSchema);