//Imported libraries
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Category = require('./Category');

try {
    //Import token validation
    const verify = require('../utils/verifytoken');

    //Import validation control
    const {
        productsMetaValidation
    } = require('../utils/validation');

    // Import Permission Checker
    const checkRole = require('../utils/CheckPermission');

    //Import Errors
    const { 
        authenticationError, 
        validationError, 
        appendError, 
        getError, 
        generalError
    } = require('../Messages/Errors');

    //Import Loggers
    const Logger = require('../Logger/Logger');
    const ErrorLogger = require('../Logger/ErrorLogger');

    //Get Categories API
    router.get('/categories/all', verify, async (req, res) => {
        try {
            //Validate user permission
            if(!(await checkRole(req.headers['auth-token'], 'Administrator'))) {
                res.send(new validationError().getErrorMessage("Illegal Access, resource not accessible by user due to role permission."));
                return ;
            }

            //Get categories in the database
            const categories = await Category.find({});

            //Operate based on categories
            if(categories && categories.length > 0) {
                res.send({
                    error: false,
                    message: 'Categories list Successfully retrieved.',
                    categoriesData: {
                        count: categories.length,
                        list: categories
                    }
                });
                var userId = 
                    jwt.decode(
                        req.headers['auth-token'],
                        process.env.TOKEN_SECRET,
                    );
                var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                Logger(userId, 'Requested all categories.', ip);
            } else {
                //Categories not found
                res.send(new getError().getErrorMessage('No categories found.'));
                return;
            }
        } catch (error) {
            res.send(new generalError().getErrorMessage(error.message));
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            ErrorLogger(
                jwt.decode(
                    req.headers['auth-token'],
                    process.env.TOKEN_SECRET,
                    )
                    ,
                error.message + ' coming from ' + req.headers.location,
                ip
            );
            console.error("Error @ Get Categories: " + error);
        }
    });

    //Get Category by id API
    router.get('/categories/:id', verify, async (req, res) => {
        try {
            //Validate user permission
            if(!(await checkRole(req.headers['auth-token'], 'Administrator'))) {
                res.send(new validationError().getErrorMessage("Illegal Access, resource not accessible by user due to role permission."));
                return ;
            }

            //Getting the id from the URL
            var id = req.params.id;

            //Check if the category is in the database
            const cat = await Category.findOne(
                {
                    _id: id
                }
            );

            if(cat) {
                res.send({
                    error: false,
                    message: 'Category found Successfully.',
                    category: cat
                });
                var userId = 
                    jwt.decode(
                        req.headers['auth-token'],
                        process.env.TOKEN_SECRET,
                    );
                var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                Logger(userId, 'Requested a category.', ip);
            } else {
                //Category not found
                res.send(new appendError().getErrorMessage('Category does not exist.'));
                return;
            }
        } catch (error) {
            res.send(new generalError().getErrorMessage(error.message));
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            ErrorLogger(
                jwt.decode(
                    req.headers['auth-token'],
                    process.env.TOKEN_SECRET,
                    )
                    ,
                error.message + ' coming from ' + req.headers.location,
                ip
            );
            console.error("Error @ Get Category By ID: " + error);
        }
    });

    //Create Categories API
    router.post('/categories', verify, async (req, res) => {
        try {
            //Validate user permission
            if(!(await checkRole(req.headers['auth-token'], 'Administrator'))) {
                res.send(new validationError().getErrorMessage("Illegal Access, resource not accessible by user due to role permission."));
                return ;
            }

            //Validate the user inputed data
            const validate = productsMetaValidation(req.body);
            if(validate.error) {
                res.send(new validationError().getErrorMessage(validate.error.details[0].message.replace('\"', "").replace('\"', "")));
                return ;
            }

            //Get Category with same name in the database
            const category = await Category.findOne({
                name: req.body.name
            });

            //Operate based on category
            if(!category) {

                //Create Category
                const newCategory = new Category({
                    name: req.body.name,
                    status: req.body.status,
                    description: req.body.description,
                });

                //Save the category to the db
                const saveCategory = await newCategory.save()
                .then(() => {
                    res.send({
                        error: false,
                        message: 'Category added Successfully.'
                    });
                    var userId = 
                        jwt.decode(
                            req.headers['auth-token'],
                            process.env.TOKEN_SECRET,
                        );
                    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                    Logger(userId, 'Added a category.', ip);
                })
                .catch((err) => {
                    res.send(new appendError().getErrorMessage(err.message));
                });
            } else {
                //Category found
                res.send(new getError().getErrorMessage('Category with same name found.'));
                return;
            }
        } catch (error) {
            res.send(new generalError().getErrorMessage(error.message));
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            ErrorLogger(
                jwt.decode(
                    req.headers['auth-token'],
                    process.env.TOKEN_SECRET,
                    )
                    ,
                error.message + ' coming from ' + req.headers.location,
                ip
            );
            console.error("Error @ Post Categories: " + error);
        }
    });

    //Update Categories API
    router.put('/categories/:id', verify, async (req, res) => {
        try {
            //Validate user permission
            if(!(await checkRole(req.headers['auth-token'], 'Administrator'))) {
                res.send(new validationError().getErrorMessage("Illegal Access, resource not accessible by user due to role permission."));
                return ;
            }

            //Getting the id from the URL
            var id = req.params.id;

            //Check if the user is in the database
            const cat = await Category.findOne(
                {
                    _id: id
                }
            );

            if(cat) {
                //Validate the user inputed data
                const validate = productsMetaValidation(req.body, true);
                if(validate.error) {
                    res.send(new validationError().getErrorMessage(validate.error.details[0].message.replace('\"', "").replace('\"', "")));
                    return ;
                }

                //Update the category
                const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { useFindAndModify: false });

                const newCategory = await Category.findOne(
                    {
                        _id: id
                    }
                );

                if(updatedCategory) {
                    res.send({
                        error: false,
                        message: 'Category updated Successfully.',
                        variation: {
                            old: updatedCategory,
                            new: newCategory
                        }
                    });
                    var userId = 
                        jwt.decode(
                            req.headers['auth-token'],
                            process.env.TOKEN_SECRET,
                        );
                    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                    Logger(userId, 'Modified a category.', ip);
                } else {
                    res.send(new appendError().getErrorMessage('Category update failed.'));
                }
            } else {
                //Category not found
                res.send(new appendError().getErrorMessage('Category does not exist.'));
                return;
            }
        } catch (error) {
            res.send(new generalError().getErrorMessage(error.message));
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            ErrorLogger(
                jwt.decode(
                    req.headers['auth-token'],
                    process.env.TOKEN_SECRET,
                    )
                    ,
                error.message + ' coming from ' + req.headers.location,
                ip
            );
            console.error("Error @ Put Categories: " + error);
        }
    });

} catch (error) {
    console.error("Error @ CATEGORYAPI.JS: " + error);
}

module.exports = router;