//Imported libraries
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Attribute = require('./Attribute');

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

    //Get Attributes API
    router.get('/attributes/all', verify, async (req, res) => {
        try {
            //Validate user permission
            if(!(await checkRole(req.headers['auth-token'], 'Administrator'))) {
                res.send(new validationError().getErrorMessage("Illegal Access, resource not accessible by user due to role permission."));
                return ;
            }

            //Get attributes in the database
            const attributes = await Attribute.find({});

            //Operate based on attributes
            if(attributes && attributes.length > 0) {
                res.send({
                    error: false,
                    message: 'Attributes list Successfully retrieved.',
                    attributesData: {
                        count: attributes.length,
                        list: attributes
                    }
                });
                var userId = 
                    jwt.decode(
                        req.headers['auth-token'],
                        process.env.TOKEN_SECRET,
                    );
                var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                Logger(userId, 'Requested all attributes.', ip);
            } else {
                //Attributes not found
                res.send(new getError().getErrorMessage('No attributes found.'));
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
            console.error("Error @ Get Attributes: " + error);
        }
    });

    //Get Attributes by id API
    router.get('/attributes/:id', verify, async (req, res) => {
        try {
            //Validate user permission
            if(!(await checkRole(req.headers['auth-token'], 'Administrator'))) {
                res.send(new validationError().getErrorMessage("Illegal Access, resource not accessible by user due to role permission."));
                return ;
            }

            //Getting the id from the URL
            var id = req.params.id;

            //Check if the attribute is in the database
            const attribute = await Attribute.findOne(
                {
                    _id: id
                }
            );

            if(attribute) {
                res.send({
                    error: false,
                    message: 'Attribute found Successfully.',
                    attribute: attribute
                });
                var userId = 
                    jwt.decode(
                        req.headers['auth-token'],
                        process.env.TOKEN_SECRET,
                    );
                var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                Logger(userId, 'Requested an attribute.', ip);
            } else {
                //Category not found
                res.send(new appendError().getErrorMessage('Attribute does not exist.'));
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
            console.error("Error @ Get Attribute By ID: " + error);
        }
    });

    //Create Categories API
    router.post('/attributes', verify, async (req, res) => {
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

            //Get attribute with same name in the database
            const attribute = await Attribute.findOne({
                name: req.body.name
            });

            //Operate based on attribute
            if(!attribute) {

                //Create attribute
                const newAttribute = new Attribute({
                    name: req.body.name,
                    status: req.body.status,
                    description: req.body.description,
                });

                //Save the attribute to the db
                const saveAttribute = await newAttribute.save()
                .then(() => {
                    res.send({
                        error: false,
                        message: 'Attribute added Successfully.'
                    });
                    var userId = 
                        jwt.decode(
                            req.headers['auth-token'],
                            process.env.TOKEN_SECRET,
                        );
                    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                    Logger(userId, 'Added an attribute.', ip);
                })
                .catch((err) => {
                    res.send(new appendError().getErrorMessage(err.message));
                });
            } else {
                //Attribute found
                res.send(new getError().getErrorMessage('Attribute with same name found.'));
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
            console.error("Error @ Post Attribute: " + error);
        }
    });

    //Update attribute API
    router.put('/attributes/:id', verify, async (req, res) => {
        try {
            //Validate user permission
            if(!(await checkRole(req.headers['auth-token'], 'Administrator'))) {
                res.send(new validationError().getErrorMessage("Illegal Access, resource not accessible by user due to role permission."));
                return ;
            }

            //Getting the id from the URL
            var id = req.params.id;

            //Check if the attribute is in the database
            const attribute = await Attribute.findOne(
                {
                    _id: id
                }
            );

            if(attribute) {
                //Validate the user inputed data
                const validate = productsMetaValidation(req.body, true);
                if(validate.error) {
                    res.send(new validationError().getErrorMessage(validate.error.details[0].message.replace('\"', "").replace('\"', "")));
                    return ;
                }

                //Update the attribute
                const updatedAttribute = await Attribute.findByIdAndUpdate(id, req.body, { useFindAndModify: false });

                const newAttribute = await Attribute.findOne(
                    {
                        _id: id
                    }
                );

                if(updatedAttribute) {
                    res.send({
                        error: false,
                        message: 'Attribute updated Successfully.',
                        variation: {
                            old: updatedAttribute,
                            new: newAttribute
                        }
                    });
                    var userId = 
                        jwt.decode(
                            req.headers['auth-token'],
                            process.env.TOKEN_SECRET,
                        );
                    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                    Logger(userId, 'Modified an attribute.', ip);
                } else {
                    res.send(new appendError().getErrorMessage('Attribute update failed.'));
                }
            } else {
                //Attribute not found
                res.send(new appendError().getErrorMessage('Attribute does not exist.'));
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
            console.error("Error @ Put Attribute: " + error);
        }
    });

} catch (error) {
    console.error("Error @ ATTRIBUTEAPI.JS: " + error);
}

module.exports = router;