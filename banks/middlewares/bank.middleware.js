
/**
 * Created by Usman on 7/31/2018.
 */

const winston = require('winston');

let validateBankParams = (req, res, next) => {

    req.assert('bankCode', 11000).notEmpty();

    req.assert('bankName', 11001).notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        winston.error('Bank Information could not be saved', errors[0]);
        return next(errors[0]);
    }

    return next();
};

module.exports = {
    validateBankParams
};