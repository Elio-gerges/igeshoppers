//Importing libraries
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Creating Sub Categories schema
const subcategoriesSchema = new mongoose.Schema(
    {
        category_id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
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

//Apply the uniqueValidator plugin to subcategoriesSchema.
subcategoriesSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Subcategory', subcategoriesSchema);