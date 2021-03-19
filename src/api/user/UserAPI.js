//Imported libraries
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const uuid = require('uuid');

try {
    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './public/imgs/img_usr');
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

    const uploadType = upload.single('picture');

    //Import token validation
    const verify = require('../utils/verifytoken');

    //Import models
    const User = require('./UserModel');
    const UserRole = require('./UserRole');

    //Import validation control
    const { 
        userValidation, 
        loginUserValidation
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

    //Login API
    router.post('/login', async (req, res) => {
        try {
            //Validate the user inputed data
            const validate = loginUserValidation(req.body);
            if(validate.error) {
                res.send(new validationError().getErrorMessage(validate.error.details[0].message.replace('\"', "").replace('\"', "")));
                return ;
            }

            //Check if the user is in the database
            const userExist = await User.findOne(
                {
                    username: req.body.username
                }
            );

            if(userExist) {
                //Getting unhashed version of password
                const validPass = await bcrypt.compare(req.body.password, userExist.password);

                if(!validPass) {
                    //Password is empty or undefined
                    res.send(new authenticationError().getErrorMessage('Username or password not found.'));
                    return ;
                } else {
                    var tokenExpiryDate = "";
                    if(req.body.rememberme == true) {
                        tokenExpiryDate = "360d"; // it will be expired after 1 hours
                        //expiresIn: "360d" // it will be expired after 20 days
                        //expiresIn: 120 // it will be expired after 120ms
                        //expiresIn: "120s" // it will be expired after 120s
                    } else {
                        tokenExpiryDate = "1h";
                    }
                    //Create and Assign a token
                    const token = jwt.sign(
                        { _id: userExist._id, },
                        process.env.TOKEN_SECRET,
                        { expiresIn: tokenExpiryDate }
                    );

                    const id = userExist._id;

                    res.header('auth-token', token).status(200).send({
                        error: false,
                        message: "Successful Login",
                        auth_token: token,
                        emp_id: id
                    });
                    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                    Logger(userExist._id, 'Successful login.', ip);
                    return ;
                }
            } else {
                //User not found
                res.send(new authenticationError().getErrorMessage('Username or password not found.'));
                return;
            }
        } catch (error) {
            res.send(new generalError().getErrorMessage(error.message));
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            ErrorLogger('N/A',
            error.message + ' coming from ' + req.headers.location,
            ip);
            console.error("Error @ User Login: " + error);
        }
    });

    //Validate token
    router.get('/validate', verify, async (req, res) => {
        res.send({
            error: false,
            valid: true,
            message: 'User is authenticated.'
        });
    });

    //Add User API
    router.post('/', verify, uploadType, async (req, res) => {
        try {
            // Validate user permission
            if(!(await checkRole(req.headers['auth-token'], 'Administrator'))) {
                res.send(new validationError().getErrorMessage("Illegal Access, resource not accessible by user due to role permission."));
                return ;
            }

            //Validate the user inputed data
            const validate = userValidation(req.body);
            if(validate.error) {
                res.send(new validationError().getErrorMessage(validate.error.details[0].message.replace('\"', "").replace('\"', "")));
                return ;
            }

            const userRole = await UserRole.findOne({
                _id: req.body.roleId
            });

            if(!userRole) {
                res.send(new validationError().getErrorMessage("Selected Role is not valid!"));
                return ;
            }

            //Check if the user is in the database
            const user = await User.findOne(
                {
                    username: req.body.username
                }
            );

            //Operate based on employee
            if(!user) {
                //Encrypting the password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(req.body.password, salt);

                //Checking the path
                var path = null;
                if (req.file) {
                    if (req.file.path) {
                        path = req.file.path;
                    } else {
                        path = 'public/imgs/img_usr/image001.png';
                    }
                } else {
                    path = 'public/imgs/img_usr/image001.png';
                }

                //Create a new user
                const newUser = new User({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    username: req.body.username,
                    password: hashedPassword,
                    email: req.body.email,
                    mobile: req.body.mobile,
                    picture:  path,
                    status: req.body.status,
                    roleId: req.body.roleId,
                    date_created: req.body.date_created,
                    date_last_modified: req.body.date_last_modified,
                });

                //Save the user to the db
                const saveUser = await newUser.save()
                    .then(() => {
                        res.send({
                            error: false,
                            message: 'User added Successfully.'
                        });
                        var userId = 
                            jwt.decode(
                                req.headers['auth-token'],
                                process.env.TOKEN_SECRET,
                            );
                        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                        Logger(userId, 'Added a user.', ip);
                    })
                    .catch((err) => {
                        res.send(new appendError().getErrorMessage(err.message));
                    });
            } else {
                //User found
                res.send(new appendError().getErrorMessage('User with same information already exist.'));
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
            console.error("Error @ Post User: " + error);
        }
    });

    //Get all users API
    router.get('/all', verify, async (req, res) => {
        try {
            // Validate user permission
            if(!(await checkRole(req.headers['auth-token'], 'Administrator'))) {
                res.send(new validationError().getErrorMessage("Illegal Access, resource not accessible by user due to role permission."));
                return ;
            }

            //Check if the user is in the database
            const users = await User.find({}).select(["-password", "-__v"]);

            //Operate based on users
            if(users) {
                res.send({
                    error: false,
                    message: 'User list Successfully retrieved.',
                    usersData: {
                        count: users.length,
                        list: users
                    }
                });
                var userId = 
                    jwt.decode(
                        req.headers['auth-token'],
                        process.env.TOKEN_SECRET,
                    );
                var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                Logger(userId, 'Requested all users.', ip);
            } else {
                //User not found
                res.send(new getError().getErrorMessage('No users found.'));
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
            console.error("Error @ Get Users: " + error);
        }
    });

    //Get User meta API
    router.get('/meta', verify, async (req, res) => {

        try {
            if(!(await checkRole(req.headers['auth-token'], 'Administrator'))) {
                res.send(new validationError().getErrorMessage("Illegal Access, resource not accessible by user due to role permission."));
                return ;
            }

            //Get user meta data from database
            const userRole = await UserRole.find({});

            //Operate based on user
            if(userRole) {
                res.send({
                    error: false,
                    message: 'User meta found Successfully.',
                    meta: {
                        userRole: userRole
                    }
                });
                var userId = 
                    jwt.decode(
                        req.headers['auth-token'],
                        process.env.TOKEN_SECRET,
                    );
                var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                Logger(userId, 'Requested user meta.', ip);
            } else {
                //User not found
                res.send(new getError().getErrorMessage('User meta does not exist.'));
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
            console.error("Error @ Get '/meta' User: " + error);
        }
    });

    //Get User API
    router.get('/:id', verify, async (req, res) => {

        if(req.params.id === "login") {
            res.send({
                error: true,
                message: "Trying to login with a GET method :)",
                YouAreA: "Genius."
            });
            return ;
        }

        try {
            if(!(await checkRole(req.headers['auth-token'], 'Administrator'))) {
                res.send(new validationError().getErrorMessage("Illegal Access, resource not accessible by user due to role permission."));
                return ;
            }

            //Getting the id from the URL
            var id = req.params.id;

            //Check if the user is in the database
            const user = await User.findOne(
                {
                    _id: id
                }
            ).select(["-password", "-__v"]).select(["-username", "-__v"]);

            //Operate based on user
            if(user) {
                res.send({
                    error: false,
                    message: 'User found Successfully.',
                    user: user
                });
                var userId = 
                    jwt.decode(
                        req.headers['auth-token'],
                        process.env.TOKEN_SECRET,
                    );
                var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                Logger(userId, 'Requested a user.', ip);
            } else {
                //User not found
                res.send(new getError().getErrorMessage('User does not exist.'));
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
            console.error("Error @ Get '/:id' User: " + error);
        }
    });

    //Delete Employee API
    // router.delete('/employee', verify, async (req, res) => {
    //     try {
    //         //Check if the employee is in the database
    //         const employee = await Employee
    //             .findOne(
    //                 {
    //                     _id: req.body.id
    //                 }
    //             )
    //             .deleteOne();
    //         //Operate based on employee
    //         if(employee) {
    //             res.send(new getEmployee().getMessage('Employee deleted Successfully.', employee));
    //             var employeeId = 
    //                 jwt.decode(
    //                     req.headers['auth-token'],
    //                     process.env.TOKEN_SECRET,
    //                 );
    //             var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    //             Logger(employeeId, 'Deleted an employee.', ip);
    //         } else {
    //             //Employee not found
    //             res.send(new getEmployeeError().getErrorMessage('Employee does not exist.'));
    //             return;
    //         }
    //     } catch (error) {
    //         res.send(new generalError().getErrorMessage(error.message));
    //         ErrorLogger(
    //             jwt.decode(
    //                 req.headers['auth-token'],
    //                 process.env.TOKEN_SECRET,
    //                 )
    //                 ,
    //             error.message + ' coming from ' + req.headers.location,
    //             req.headers.host
    //         );
    //         console.error("Error @ Delete Employee: " + error);
    //     }
    // });

    //Update User API
    router.put('/:id', verify, async (req, res) => {
        try {
            //Getting the id from the URL
            var id = req.params.id;

            //Check if the user is in the database
            const user = await User.findOne(
                {
                    _id: id
                }
            );

            //Operate based on user
            if(user) {
                //Validate the user inputed data
                const validate = userValidation(req.body, true);
                if(validate.error) {
                    res.send(new validationError().getErrorMessage(validate.error.details[0].message.replace('\"', "").replace('\"', "")));
                } else {
                    //Update the user
                    const updatedUser = await User.findByIdAndUpdate(id, req.body, { useFindAndModify: false });
                    
                    //Getting the updated user
                    const newUser = await User.findOne(
                        {
                            _id: id
                        }
                    )
                    .select(["-password", "-__v"])
                    .select(["-username", "-__v"]);
                    if(updatedUser) {
                        res.send({
                            error: false,
                            message: 'User updated Successfully.',
                            variation: {
                                old: updatedUser,
                                new: newUser
                            }
                        });
                        var userId = 
                            jwt.decode(
                                req.headers['auth-token'],
                                process.env.TOKEN_SECRET,
                            );
                        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                        Logger(userId, 'Modified a user.', ip);
                    } else {
                        res.send(new appendError().getErrorMessage('User update failed.'));
                    }
                }
            } else {
                //Employee not found
                res.send(new getEmployeeError().getErrorMessage('User does not exist.'));
                return;
            }
        } catch (error) {
            res.send(new generalError().getErrorMessage(error.message));
            ErrorLogger(
                jwt.decode(
                    req.headers['auth-token'],
                    process.env.TOKEN_SECRET,
                    )
                    ,
                error.message + ' coming from ' + req.headers.location,
                req.headers.host
            );
            console.error("Error @ Update User: " + error);
        }
    });

} catch (error) {
    console.error("Error @ USERAPI.JS: " + error);
}

module.exports = router;