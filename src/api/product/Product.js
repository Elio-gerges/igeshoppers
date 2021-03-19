const { ObjectID } = require('bson');
const mongoose = require('mongoose');

const { Schema } = mongoose;

const productSchema = new Schema({
    name: { type: String, required: true },
    subcategory_id: { type: ObjectID, required: true },
    brand_id: { type: ObjectID, required: true },
    attribute_id: { type: ObjectID, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    barcode: { type: String, required: true, unique: true },
    nutritionfacts: {
        servings_per_container: { type: String, required: true },
        serving_size: { type: String },
        calories: { type: Number, required: true },
        total_fat: { type: Number, required: true },
        total_fat_percentage: { type: Number, required: true },
        saturated_fat: { type: Number, required: true },
        saturated_fat_percentage: { type: Number, required: true },
        trans_fat: { type: Number, required: true },
        cholesterol: { type: Number, required: true },
        cholesterol_percentage: { type: Number, required: true },
        soduim: { type: Number, required: true },
        soduim_percentage: { type: Number, required: true },
        carbohydrates: { type: Number, required: true },
        carbohydrates_percentage: { type: Number, required: true },
        fibers: { type: Number, required: true },
        fibers_percentage: { type: Number, required: true },
        total_sugar: { type: Number, required: true },
        added_sugar: { type: Number, required: true },
        added_sugar_percentage: { type: Number, required: true },
        protein: { type: Number, required: true },
        vitamin_d: { type: Number, required: true },
        vitamin_d_percentage: { type: Number, required: true },
        calcium: { type: Number, required: true },
        calcium_percentage: { type: Number, required: true },
        iron: { type: Number, required: true },
        iron_percentage: { type: Number, required: true },
        potassium: { type: Number, required: true },
        potassium_percentage: { type: Number, required: true },
    },
    volume: {
        width: { type: Number, required: true },
        height: { type: Number, required: true },
        depth: { type: Number, required: true },
    },
    inventory: {
        stock_qtt: { type: Number, required: true },
        cost: { type: Number, required: true },
        vat: { type: Number, required: true },
        profit_margin: { type: Number, required: true },
        min_stock_level: { type: Number, required: true },
    },
    status: { type: Boolean, required: true },
    created: { type: Date, default: new Date() },
    last_modified: { type: Date, default: new Date() }
});


module.exports = mongoose.model('Products', productSchema);