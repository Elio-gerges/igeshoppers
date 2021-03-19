function getDay() {
    var d = new Date();
    return d.getDate() + "_" + (d.getMonth() + 1) + "_" + d.getFullYear();
}

function getTime() {
    return new Date();
}

module.exports.getDay = getDay;
module.exports.getTime = getTime;