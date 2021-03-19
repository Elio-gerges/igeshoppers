// Importing Libraries
const jwt = require('jsonwebtoken');

// Importing modules
const User = require('../user/UserModel');
const UserRole = require('../user/UserRole');

const getUserID = (token) => {
    return jwt.decode(token, process.env.TOKEN_SECRET);
}

const checkRole = (token, role) => {
    try {
        return true; //TODO: REMVE THIS LINE
        return new Promise(async (resolve, reject) => {
            try {
                //Check if the user is in the database
                const user = await User.findOne(
                    {
                        _id: getUserID(token)
                    }
                );
        
                const userRole = await UserRole.findOne({
                    role: role
                });
        
                if(!user || !userRole) {
                    resolve(false);
                }
        
                if(user.roleId == userRole.roleId) {
                    resolve(true);
                }
        
            } catch (error) {
                reject(error);
            }
            
            resolve(false);
        });
    } catch (error) {
        console.log('Error CHECKPERMISSION.JS', CHECKPERMISSION>JS)
    }
}

module.exports = checkRole;