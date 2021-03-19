//Imported libraries
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const uuid = require('uuid');
const Product = require('./Product');
const Attribute = require('../attribute/Attribute');
const Subcategory = require('../subcategory/Subcategory');
const Brand = require('../brand/Brand');

try {
    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './public/imgs/img_prod');
        },
        filename: function(req, file, cb) {
            file.filename = file ? uuid.v1() : "image001.png";
            cb(null, file.filename);
        }
    });
    
    const filter = (req, file, cb) => {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Files Allowed are only JPEG or PNG!'), false);
        }
    };
    
    const upload = multer({
        storage: storage, 
        limits: {
            fileSize: 1024 * 1024 * 5
        },
        fileFilter: filter
    });

    const uploadType = upload.single('image');

    //Import token validation
    const verify = require('../utils/verifytoken');

    //Import validation control
    const {
        productValidation
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

    //Get Product meta API
    router.get('/products/meta', verify, async (req, res) => {
        try {
            //Validate user permission
            if(!(await checkRole(req.headers['auth-token'], 'Administrator'))) {
                res.send(new validationError().getErrorMessage("Illegal Access, resource not accessible by user due to role permission."));
                return ;
            }

            // Content holder
            var content = {};

            // Get the list of categories
            var Category = require('../category/Category');
            var categories = await Category.find({});
            if(categories && categories.length > 0) {
                content.categories = reviseData(categories);
            } else {
                content.categories = "No Categories Found";
            }

            // Get the list of subcategories
            var Subcategory = require('../subcategory/Subcategory');
            var subcategories = await Subcategory.find({});
            if(subcategories && subcategories.length > 0) {
                content.subcategories = reviseData(subcategories);
            } else {
                content.subcategories = "No Subcategories Found";
            }

            // Get the list of brands
            var Brand = require('../brand/Brand');
            var brands = await Brand.find({});
            if(brands && brands.length > 0) {
                content.brands = reviseData(brands);
            } else {
                content.brands = "No Brands Found";
            }

            // Get the list of attributes
            var Attribute = require('../attribute/Attribute');
            var attributes = await Attribute.find({});
            if(attributes && attributes.length > 0) {
                content.attributes = reviseData(attributes);
            } else {
                content.attributes = "No Attributes Found";
            }

            res.send({
                error: false,
                message: 'Product Meta Successfully retrieved.',
                meta: content
            });
            var userId = 
                jwt.decode(
                    req.headers['auth-token'],
                    process.env.TOKEN_SECRET,
                );
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            Logger(userId, 'Requested all products.', ip);

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
            console.error("Error @ Get Product: " + error);
        }
    });

    function reviseData(data) {
        var list = [];

        data.forEach(item => {
            list.push({
                id: item["_id"],
                name: item["name"],
                status: item["status"]
            });
        });

        return list;
    }

    //Get Products API
    router.get('/products/all', verify, async (req, res) => {
        try {
            //Validate user permission
            if(!(await checkRole(req.headers['auth-token'], 'Administrator'))) {
                res.send(new validationError().getErrorMessage("Illegal Access, resource not accessible by user due to role permission."));
                return ;
            }

            //Get products in the database
            const products = await Product.find({});

            //Operate based on products
            if(products && products.length > 0) {
                res.send({
                    error: false,
                    message: 'Product list Successfully retrieved.',
                    productsData: {
                        count: products.length,
                        list: products
                    }
                });
                var userId = 
                    jwt.decode(
                        req.headers['auth-token'],
                        process.env.TOKEN_SECRET,
                    );
                var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                Logger(userId, 'Requested all products.', ip);
            } else {
                //User not found
                res.send(new getError().getErrorMessage('No products found.'));
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
            console.error("Error @ Get Product: " + error);
        }
    });

    //Get products by id API
    router.get('/products/:id', verify, async (req, res) => {
        try {
            //Validate user permission
            if(!(await checkRole(req.headers['auth-token'], 'Administrator'))) {
                res.send(new validationError().getErrorMessage("Illegal Access, resource not accessible by user due to role permission."));
                return ;
            }

            //Getting the id from the URL
            var id = req.params.id;

            //Check if the product is in the database
            const product = await Product.findOne(
                {
                    _id: id
                }
            );

            if(product) {
                res.send({
                    error: false,
                    message: 'Product found Successfully.',
                    product: product
                });
                var userId = 
                    jwt.decode(
                        req.headers['auth-token'],
                        process.env.TOKEN_SECRET,
                    );
                var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                Logger(userId, 'Requested a product.', ip);
            } else {
                //Product not found
                res.send(new appendError().getErrorMessage('Product does not exist.'));
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
            console.error("Error @ Get Product By ID: " + error);
        }
    });

    //Create product API
    router.post('/products', uploadType, verify, async (req, res) => {
        try {
            //Validate user permission
            if(!(await checkRole(req.headers['auth-token'], 'Administrator'))) {
                res.send(new validationError().getErrorMessage("Illegal Access, resource not accessible by user due to role permission."));
                return ;
            }

            //Validate the user inputed data
            req.body.nutritionfacts = JSON.parse(req.body.nutritionfacts);
            req.body.volume = JSON.parse(req.body.volume);
            req.body.inventory = JSON.parse(req.body.inventory);
            
            const validate = productValidation(req.body);
            if(validate.error) {
                res.send(new validationError().getErrorMessage(validate.error.details[0].message.replace('\"', "").replace('\"', "")));
                return ;
            }

            //Check if subcategory id is correct
            const subcategory = await Subcategory.findOne({
                _id: req.body.subcategory_id
            });

            if(!subcategory) {
                //Subcategory Not found
                res.send(new getError().getErrorMessage('Invalid Subcategory ID.'));
                return;
            }

            //Check if attribute id is correct
            const attribute = await Attribute.findOne({
                _id: req.body.attribute_id
            });

            if(!attribute) {
                //Attribute Not found
                res.send(new getError().getErrorMessage('Invalid Attribute ID.'));
                return;
            }

            //Check if brand id is correct
            const brand = await Brand.findOne({
                _id: req.body.brand_id
            });

            if(!brand) {
                //Brand Not found
                res.send(new getError().getErrorMessage('Invalid Brand ID.'));
                return;
            }

            //Image of the product
            var path = null;
            if (req.file) {
                if (req.file.path) {
                    path = req.file.path;
                } else {
                    path = 'public/imgs/img_prod/image001.png';
                }
            } else {
                path = 'public/imgs/img_prod/image001.png';
            }

            //Get product with same barcode in the database
            const product = await Product.findOne({
                barcode: req.body.barcode
            });

            //Operate based on product
            if(!product) {
                //Create product
                const newProduct = new Product({
                    name: req.body.name,
                    subcategory_id: req.body.subcategory_id,
                    brand_id: req.body.brand_id,
                    attribute_id: req.body.attribute_id,
                    description: req.body.description,
                    image: path,
                    barcode: req.body.barcode,
                    nutritionfacts: req.body.nutritionfacts,
                    volume: req.body.volume,
                    inventory: req.body.inventory,
                    status: req.body.status,
                });

                //Save the product to the db
                const saveProduct = await newProduct.save()
                .then(() => {
                    res.send({
                        error: false,
                        message: 'Product added Successfully.'
                    });
                    var userId = 
                        jwt.decode(
                            req.headers['auth-token'],
                            process.env.TOKEN_SECRET,
                        );
                    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                    Logger(userId, 'Added a Product.', ip);
                })
                .catch((err) => {
                    res.send(new appendError().getErrorMessage(err.message));
                });
            } else {
                //Product found
                res.send(new getError().getErrorMessage('Product with same barcode found.'));
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
            console.error("Error @ Post Product: " + error);
        }
    });

    //Update products API
    router.put('/products/:id', uploadType, verify, async (req, res) => {
        try {
            //Validate user permission
            if(!(await checkRole(req.headers['auth-token'], 'Administrator'))) {
                res.send(new validationError().getErrorMessage("Illegal Access, resource not accessible by user due to role permission."));
                return ;
            }

            //Getting the id from the URL
            var id = req.params.id;

            //Check if the product is in the database
            const prod = await Product.findOne(
                {
                    _id: id
                }
            );

            //Operate based on product
            if(prod) {
                //Validate the user inputed data
                if(req.body.nutritionfacts) {
                    req.body.nutritionfacts = JSON.parse(req.body.nutritionfacts);
                }
                if(req.body.volume) {
                    req.body.volume = JSON.parse(req.body.volume);
                }
                if(req.body.inventory) {
                    req.body.inventory = JSON.parse(req.body.inventory);
                }
                const validate = productValidation(req.body, true);
                if(validate.error) {
                    res.send(new validationError().getErrorMessage(validate.error.details[0].message.replace('\"', "").replace('\"', "")));
                    return ;
                }

                if(req.body.subcategory_id) {
                    //Check if subcategory id is correct
                    const subcategory = await Subcategory.findOne({
                        _id: req.body.subcategory_id
                    });

                    if(!subcategory) {
                        //Subcategory Not found
                        res.send(new getError().getErrorMessage('Invalid Subcategory ID.'));
                        return;
                    }
                }

                if(req.body.brand_id) {
                    //Check if brand id is correct
                    const brand = await Brand.findOne({
                        _id: req.body.brand_id
                    });

                    if(!brand) {
                        //Brand Not found
                        res.send(new getError().getErrorMessage('Invalid Brand ID.'));
                        return;
                    }
                }

                if(req.body.attribute_id) {
                    //Check if attribute id is correct
                    const attribute = await Attribute.findOne({
                        _id: req.body.attribute_id
                    });

                    if(!attribute) {
                        //Attribute Not found
                        res.send(new getError().getErrorMessage('Invalid Attribute ID.'));
                        return;
                    }
                }

                //Removing the image
                delete req.body.image;

                //Update the product
                const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { useFindAndModify: false });

                const newProduct = await Product.findOne(
                    {
                        _id: id
                    }
                );

                if(updatedProduct) {
                    res.send({
                        error: false,
                        message: 'Product updated Successfully.',
                        variation: {
                            old: updatedProduct,
                            new: newProduct
                        }
                    });
                    var userId = 
                        jwt.decode(
                            req.headers['auth-token'],
                            process.env.TOKEN_SECRET,
                        );
                    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                    Logger(userId, 'Modified a product.', ip);
                } else {
                    res.send(new appendError().getErrorMessage('Product update failed.'));
                }
            } else {
                //Product not found
                res.send(new appendError().getErrorMessage('Product does not exist.'));
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
            console.error("Error @ Put Product: " + error);
        }
    });

} catch (error) {
    console.error("Error @ PRODUCTAPI.JS: " + error);
}

module.exports = router;