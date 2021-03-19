function authenticationError() {
    this.getErrorMessage = (msg) => {
        return {
            error: true,
            error_code: 101,
            error_message: msg
        }
    }
}

function validationError() {
    this.getErrorMessage = (msg) => {
        return {
            error: true,
            error_code: 102,
            error_message: msg
        }
    }
}

function appendError() {
    this.getErrorMessage = (msg) => {
        return {
            error: true,
            error_code: 103,
            error_message: msg
        }
    }
}

function getError() {
    this.getErrorMessage = (msg) => {
        return {
            error: true,
            error_code: 105,
            error_message: msg
        }
    }
}

function tokenVerificationError() {
    this.getErrorMessage = (msg) => {
        return {
            error: true,
            error_code: 104,
            error_message: msg
        }
    }
}

function generalError() {
    this.getErrorMessage = (msg) => {
        return {
            error: true,
            error_code: 100,
            error_message: msg
        }
    }
}

module.exports.authenticationError = authenticationError;
module.exports.validationError = validationError;
module.exports.appendError = appendError;
module.exports.getError = getError;
module.exports.tokenVerificationError = tokenVerificationError;
module.exports.generalError = generalError;