//Importing libraries
const Joi = require('joi');
const Joid = require('joi-oid');

//Add User validation
const userValidation = (data, update) => {
    var schema = null;
    if(update) {
        schema = Joi.object({
            firstname: Joi.string().min(1),
            lastname: Joi.string().min(1),
            username: Joi.string().min(5),
            password: Joi.string().min(5),
            email: Joi.string().min(5),
            mobile: Joi.string().min(5),
            status: Joi.boolean(),
            roleId: Joi.string()
        });
    } else {
        schema = Joi.object({
            firstname: Joi.string().min(1).required(),
            lastname: Joi.string().min(1).required(),
            username: Joi.string().min(5).required(),
            password: Joi.string().min(5).required(),
            email: Joi.string().min(5).required(),
            mobile: Joi.string().min(5).required(),
            status: Joi.boolean(),
            roleId: Joi.string()
        });
    }

    //Lets validate the data before we create a user
    return schema.validate(data);
}

//Login User validation
const loginUserValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(5).required(),
        password: Joi.string().min(5).required(),
        rememberme: Joi.boolean()
    });

    //Lets validate the data before we allow the user to login
    return schema.validate(data);
}

//Common Products Meta
const productsMetaValidation = (data, update) => {
    var schema = null;
    
    if(update) {
        schema = Joi.object({
            name: Joi.string().min(1),
            description: Joi.string().min(1),
            status: Joi.boolean(),
        });
    } else {
        schema = Joi.object({
            name: Joi.string().min(1).required(),
            description: Joi.string().min(1).required(),
            status: Joi.boolean().required(),
        });
    }

    //Lets validate the data before we create a meta data for the product
    return schema.validate(data);
}

//Common Products Subcategory
const subcategoryValidation = (data, update) => {
    var schema = null;
    
    if(update) {
        schema = Joi.object({
            category_id: Joid.objectId(),
            name: Joi.string().min(1),
            description: Joi.string().min(1),
            status: Joi.boolean(),
        });
    } else {
        schema = Joi.object({
            category_id: Joid.objectId().required(),
            name: Joi.string().min(1).required(),
            description: Joi.string().min(1).required(),
            status: Joi.boolean().required(),
        });
    }

    //Lets validate the data before we create a meta data for the product Subcategory
    return schema.validate(data);
}

//Common Products Subcategory
const productValidation = (data, update) => {
    var schema = null;
    
    if(update) {
        schema = Joi.object({
            name: Joi.string(),
            subcategory_id: Joid.objectId(),
            brand_id: Joid.objectId(),
            attribute_id: Joid.objectId(),
            description: Joi.string().min(5),
            barcode: Joi.string(),
            image: Joi.string(),
            nutritionfacts: {
                servings_per_container: Joi.string(),
                serving_size: Joi.number(),
                calories: Joi.number(),
                total_fat: Joi.number(),
                total_fat_percentage: Joi.number(),
                saturated_fat: Joi.number(),
                saturated_fat_percentage: Joi.number(),
                trans_fat: Joi.number(),
                cholesterol: Joi.number(),
                cholesterol_percentage: Joi.number(),
                soduim: Joi.number(),
                soduim_percentage: Joi.number(),
                carbohydrates: Joi.number(),
                carbohydrates_percentage: Joi.number(),
                fibers: Joi.number(),
                fibers_percentage: Joi.number(),
                total_sugar: Joi.number(),
                added_sugar: Joi.number(),
                added_sugar_percentage: Joi.number(),
                protein: Joi.number(),
                vitamin_d: Joi.number(),
                vitamin_d_percentage: Joi.number(),
                calcium: Joi.number(),
                calcium_percentage: Joi.number(),
                iron: Joi.number(),
                iron_percentage: Joi.number(),
                potassium: Joi.number(),
                potassium_percentage: Joi.number(),
            },
            volume: {
                width: Joi.number(),
                height: Joi.number(),
                depth: Joi.number(),
            },
            inventory: {
                stock_qtt: Joi.number(),
                cost: Joi.number(),
                vat: Joi.number(),
                profit_margin: Joi.number(),
                min_stock_level: Joi.number(),
            },
            status: Joi.boolean(),
        });
    } else {
        schema = Joi.object({
            name: Joi.string().required(),
            subcategory_id: Joid.objectId().required(),
            brand_id: Joid.objectId().required(),
            attribute_id: Joid.objectId().required(),
            description: Joi.string().min(5).required(),
            barcode: Joi.string().required(),
            image: Joi.string(),
            nutritionfacts: {
                servings_per_container: Joi.string().required(),
                serving_size: Joi.number().required(),
                calories: Joi.number().required(),
                total_fat: Joi.number().required(),
                total_fat_percentage: Joi.number().required(),
                saturated_fat: Joi.number().required(),
                saturated_fat_percentage: Joi.number().required(),
                trans_fat: Joi.number().required(),
                cholesterol: Joi.number().required(),
                cholesterol_percentage: Joi.number().required(),
                soduim: Joi.number().required(),
                soduim_percentage: Joi.number().required(),
                carbohydrates: Joi.number().required(),
                carbohydrates_percentage: Joi.number().required(),
                fibers: Joi.number().required(),
                fibers_percentage: Joi.number().required(),
                total_sugar: Joi.number().required(),
                added_sugar: Joi.number().required(),
                added_sugar_percentage: Joi.number().required(),
                protein: Joi.number().required(),
                vitamin_d: Joi.number().required(),
                vitamin_d_percentage: Joi.number().required(),
                calcium: Joi.number().required(),
                calcium_percentage: Joi.number().required(),
                iron: Joi.number().required(),
                iron_percentage: Joi.number().required(),
                potassium: Joi.number().required(),
                potassium_percentage: Joi.number().required(),
            },
            volume: {
                width: Joi.number().required(),
                height: Joi.number().required(),
                depth: Joi.number().required(),
            },
            inventory: {
                stock_qtt: Joi.number().required(),
                cost: Joi.number().required(),
                vat: Joi.number().required(),
                profit_margin: Joi.number().required(),
                min_stock_level: Joi.number().required(),
            },
            status: Joi.boolean().required(),
        });
    }

    //Lets validate the data before we create a product
    return schema.validate(data);
}

//Exporting the modules
module.exports.userValidation = userValidation;
module.exports.loginUserValidation = loginUserValidation;
module.exports.productsMetaValidation = productsMetaValidation;
module.exports.subcategoryValidation = subcategoryValidation;
module.exports.productValidation = productValidation;