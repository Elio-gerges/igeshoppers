//Imported libraries
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Brand = require('./Brand');

try {
    //Import token validation
    const verify = require('../utils/verifytoken');

    //Import models
    const Brand = require('./Brand');

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

    //Get Brands API
    router.get('/brands/all', verify, async (req, res) => {
        try {
            //Validate user permission
            if(!(await checkRole(req.headers['auth-token'], 'Administrator'))) {
                res.send(new validationError().getErrorMessage("Illegal Access, resource not accessible by user due to role permission."));
                return ;
            }

            //Get brands in the database
            const brands = await Brand.find({});

            //Operate based on users
            if(brands && brands.length > 0) {
                res.send({
                    error: false,
                    message: 'Brands list Successfully retrieved.',
                    brandsData: {
                        count: brands.length,
                        list: brands
                    }
                });
                var userId = 
                    jwt.decode(
                        req.headers['auth-token'],
                        process.env.TOKEN_SECRET,
                    );
                var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                Logger(userId, 'Requested all brands.', ip);
            } else {
                //User not found
                res.send(new getError().getErrorMessage('No brands found.'));
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
            console.error("Error @ Get Brands: " + error);
        }
    });

    //Get Brand by id API
    router.get('/brands/:id', verify, async (req, res) => {
        try {
            //Validate user permission
            if(!(await checkRole(req.headers['auth-token'], 'Administrator'))) {
                res.send(new validationError().getErrorMessage("Illegal Access, resource not accessible by user due to role permission."));
                return ;
            }

            //Getting the id from the URL
            var id = req.params.id;

            //Check if the brand is in the database
            const brand = await Brand.findOne(
                {
                    _id: id
                }
            );

            if(brand) {
                res.send({
                    error: false,
                    message: 'Brand found Successfully.',
                    brand: brand
                });
                var userId = 
                    jwt.decode(
                        req.headers['auth-token'],
                        process.env.TOKEN_SECRET,
                    );
                var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                Logger(userId, 'Requested a brand.', ip);
            } else {
                //Category not found
                res.send(new appendError().getErrorMessage('Brand does not exist.'));
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
            console.error("Error @ Get Brand By ID: " + error);
        }
    });

    //Create Categories API
    router.post('/brands', verify, async (req, res) => {
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

            //Get Brand with same name in the database
            const brand = await Brand.findOne({
                name: req.body.name
            });

            //Operate based on brand
            if(!brand) {

                //Create brand
                const newBrand = new Brand({
                    name: req.body.name,
                    status: req.body.status,
                    description: req.body.description,
                });

                //Save the brand to the db
                const saveBrand = await newBrand.save()
                .then(() => {
                    res.send({
                        error: false,
                        message: 'Brand added Successfully.'
                    });
                    var userId = 
                        jwt.decode(
                            req.headers['auth-token'],
                            process.env.TOKEN_SECRET,
                        );
                    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                    Logger(userId, 'Added a brand.', ip);
                })
                .catch((err) => {
                    res.send(new appendError().getErrorMessage(err.message));
                });
            } else {
                //Brand found
                res.send(new getError().getErrorMessage('Brand with same name found.'));
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
            console.error("Error @ Post Brand: " + error);
        }
    });

    //Update Brand API
    router.put('/brands/:id', verify, async (req, res) => {
        try {
            //Validate user permission
            if(!(await checkRole(req.headers['auth-token'], 'Administrator'))) {
                res.send(new validationError().getErrorMessage("Illegal Access, resource not accessible by user due to role permission."));
                return ;
            }

            //Getting the id from the URL
            var id = req.params.id;

            //Check if the user is in the database
            const brand = await Brand.findOne(
                {
                    _id: id
                }
            );

            if(brand) {
                //Validate the user inputed data
                const validate = productsMetaValidation(req.body, true);
                if(validate.error) {
                    res.send(new validationError().getErrorMessage(validate.error.details[0].message.replace('\"', "").replace('\"', "")));
                    return ;
                }

                //Update the brand
                const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, { useFindAndModify: false });

                const newBrand = await Brand.findOne(
                    {
                        _id: id
                    }
                );

                if(updatedBrand) {
                    res.send({
                        error: false,
                        message: 'Brand updated Successfully.',
                        variation: {
                            old: updatedBrand,
                            new: newBrand
                        }
                    });
                    var userId = 
                        jwt.decode(
                            req.headers['auth-token'],
                            process.env.TOKEN_SECRET,
                        );
                    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                    Logger(userId, 'Modified a brand.', ip);
                } else {
                    res.send(new appendError().getErrorMessage('Brand update failed.'));
                }
            } else {
                //Brand not found
                res.send(new appendError().getErrorMessage('Brand does not exist.'));
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
            console.error("Error @ Put Brand: " + error);
        }
    });

} catch (error) {
    console.error("Error @ BRANDAPI.JS: " + error);
}

module.exports = router;