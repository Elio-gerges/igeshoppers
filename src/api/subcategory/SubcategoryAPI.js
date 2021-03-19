//Imported libraries
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Subcategory = require('./Subcategory');
const Category = require('../category/Category');

try {
    //Import token validation
    const verify = require('../utils/verifytoken');

    //Import validation control
    const {
        subcategoryValidation
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

    //Get Subcategories API
    router.get('/subcategories/all', verify, async (req, res) => {
        try {
            //Validate user permission
            if(!(await checkRole(req.headers['auth-token'], 'Administrator'))) {
                res.send(new validationError().getErrorMessage("Illegal Access, resource not accessible by user due to role permission."));
                return ;
            }

            //Get subcategories in the database
            const subcategories = await Subcategory.find({});

            //Operate based on subcategories
            if(subcategories && subcategories.length > 0) {
                res.send({
                    error: false,
                    message: 'Subcategories list Successfully retrieved.',
                    subcategoriesData: {
                        count: subcategories.length,
                        list: subcategories
                    }
                });
                var userId = 
                    jwt.decode(
                        req.headers['auth-token'],
                        process.env.TOKEN_SECRET,
                    );
                var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                Logger(userId, 'Requested all subcategories.', ip);
            } else {
                //Subcategories not found
                res.send(new getError().getErrorMessage('No subcategories found.'));
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
            console.error("Error @ Get Subcategories: " + error);
        }
    });

    //Get subcategories by id API
    router.get('/subcategories/:id', verify, async (req, res) => {
        try {
            //Validate user permission
            if(!(await checkRole(req.headers['auth-token'], 'Administrator'))) {
                res.send(new validationError().getErrorMessage("Illegal Access, resource not accessible by user due to role permission."));
                return ;
            }

            //Getting the id from the URL
            var id = req.params.id;

            //Check if the subcategory is in the database
            const subcategory = await Subcategory.findOne(
                {
                    _id: id
                }
            );

            if(subcategory) {
                res.send({
                    error: false,
                    message: 'Subcategory found Successfully.',
                    subcategory: subcategory
                });
                var userId = 
                    jwt.decode(
                        req.headers['auth-token'],
                        process.env.TOKEN_SECRET,
                    );
                var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                Logger(userId, 'Requested a subcategory.', ip);
            } else {
                //Subcategory not found
                res.send(new appendError().getErrorMessage('Subcategory does not exist.'));
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
            console.error("Error @ Get Subcategory By ID: " + error);
        }
    });

    //Create subcategory API
    router.post('/subcategories', verify, async (req, res) => {
        try {
            //Validate user permission
            if(!(await checkRole(req.headers['auth-token'], 'Administrator'))) {
                res.send(new validationError().getErrorMessage("Illegal Access, resource not accessible by user due to role permission."));
                return ;
            }

            //Validate the user inputed data
            const validate = subcategoryValidation(req.body);
            if(validate.error) {
                res.send(new validationError().getErrorMessage(validate.error.details[0].message.replace('\"', "").replace('\"', "")));
                return ;
            }

            //Check if category id is correct
            const category = await Category.findOne({
                _id: req.body.category_id
            });

            if(!category) {
                //Category Not found
                res.send(new getError().getErrorMessage('Invalid Category ID.'));
                return;
            }

            //Get subcategory with same name in the database
            const subcategory = await Subcategory.findOne({
                name: req.body.name
            });

            //Operate based on subcategory
            if(!subcategory) {

                //Create Subcategory
                const newSubcategory = new Subcategory({
                    category_id: req.body.category_id,
                    name: req.body.name,
                    status: req.body.status,
                    description: req.body.description,
                });

                //Save the Subcategory to the db
                const saveSubcategory = await newSubcategory.save()
                .then(() => {
                    res.send({
                        error: false,
                        message: 'Subcategory added Successfully.'
                    });
                    var userId = 
                        jwt.decode(
                            req.headers['auth-token'],
                            process.env.TOKEN_SECRET,
                        );
                    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                    Logger(userId, 'Added a Subcategory.', ip);
                })
                .catch((err) => {
                    res.send(new appendError().getErrorMessage(err.message));
                });
            } else {
                //Subcategory found
                res.send(new getError().getErrorMessage('Subcategory with same name found.'));
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
            console.error("Error @ Post Subcategory: " + error);
        }
    });

    //Update Subcategory API
    router.put('/subcategories/:id', verify, async (req, res) => {
        try {
            //Validate user permission
            if(!(await checkRole(req.headers['auth-token'], 'Administrator'))) {
                res.send(new validationError().getErrorMessage("Illegal Access, resource not accessible by user due to role permission."));
                return ;
            }

            //Getting the id from the URL
            var id = req.params.id;

            //Check if the Subcategory is in the database
            const subcategory = await Subcategory.findOne(
                {
                    _id: id
                }
            );

            if(req.body.category_id) {
                //Check if category id is correct
                const category = await Category.findOne({
                    _id: req.body.category_id
                });

                if(!category) {
                    //Category Not found
                    res.send(new getError().getErrorMessage('Invalid Category ID.'));
                    return;
                }
            }

            if(subcategory) {
                //Validate the user inputed data
                const validate = subcategoryValidation(req.body, true);
                if(validate.error) {
                    res.send(new validationError().getErrorMessage(validate.error.details[0].message.replace('\"', "").replace('\"', "")));
                    return ;
                }

                //Update the Subcategory
                const updatedSubcategory = await Subcategory.findByIdAndUpdate(id, req.body, { useFindAndModify: false });

                const newSubcategory = await Subcategory.findOne(
                    {
                        _id: id
                    }
                );

                if(updatedSubcategory) {
                    res.send({
                        error: false,
                        message: 'Subcategory updated Successfully.',
                        variation: {
                            old: updatedSubcategory,
                            new: newSubcategory
                        }
                    });
                    var userId = 
                        jwt.decode(
                            req.headers['auth-token'],
                            process.env.TOKEN_SECRET,
                        );
                    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                    Logger(userId, 'Modified a Subcategory.', ip);
                } else {
                    res.send(new appendError().getErrorMessage('Subcategory update failed.'));
                }
            } else {
                //Subcategory not found
                res.send(new appendError().getErrorMessage('Subcategory does not exist.'));
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
            console.error("Error @ Put Subcategory: " + error);
        }
    });

} catch (error) {
    console.error("Error @ SUBCATEGORYAPI.JS: " + error);
}

module.exports = router;