//Import Libraries
const filewriter = require('../Utils/FileWriter');
const { getDay, getTime } = require('../Utils/DateTime');

//Import Model
const Log = require('../utils/Log');

module.exports = async function (userID, description, ipAddress,) {
    try {
        //Create a new ErrorLog
        const alog = new Log({
            userId: userID,
            description: description,
            ip_address: ipAddress
        });

        //Save the Error to the db
        const saveLog = await alog.save()
            .then(() => {
                filewriter(getFileName(), formatOutput(userID, description, ipAddress));
            })
            .catch((err) => {
                filewriter(getErrorFileName(), formatOutput("SYSTEM", err.message, "0.0.0.0"));
            });
    } catch (error) {
        console.error("Error @ Logger: " + error);
    }
}

function getFileName() {
    return './Logs/Logs/' + getDay() + '.log';
}

function getErrorFileName() {
    return './Logs/ErrorLogs/' + getDay() + '.log';
}

function formatOutput(userID, description, ipAddress) {
    return getTime() + "-" + "User_" + userID
        + "#" + ipAddress + ":" + description;
}