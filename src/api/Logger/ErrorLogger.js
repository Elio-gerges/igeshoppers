//Import Libraries
const filewriter = require('../Utils/FileWriter');
const { getDay, getTime } = require('../Utils/DateTime');

//Import Model
const ErrorLog = require('../utils/ErrorLog');

module.exports = async function (userID, description, ipAddress) {
    try {
        //Create a new ErrorLog
        const error = new ErrorLog({
            userId: userID,
            description: description,
            ip_address: ipAddress
        });

        //Save the Error to the db
        const saveError = await error.save()
            .then(() => {
                filewriter(getFileName(), formatOutput(userID, description, ipAddress));
            })
            .catch((err) => {
                filewriter(getFileName(), formatOutput("SYSTEM", err.message, "0.0.0.0"));
            });
    } catch (error) {
        console.error("Error @ Error Logger: " + error);
    }
}

function getFileName() {
    return './Logs/ErrorLogs/' + getDay() + '.log'; 
}

function formatOutput(userID, description, ipAddress) {
    return getTime() + "-" + "User_" + userID
        + "#" + ipAddress + ":" + description;
}