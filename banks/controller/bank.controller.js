/** 
 * Created by usmaniqbak 31/7/2k18
*/
const passport = require('passport'),
    responseModule = require('../../../../../config/response'),
    mongoose = require('mongoose'),
    Banks = mongoose.model('Banks'),
    winston = require('winston'),
    _ = require('lodash'),
    Logs = mongoose.model('log');

/* Get Banks */
let getBanks = (req, res, next) => {
    let offset = parseInt(req.params.offset),
        limit = parseInt(req.params.limit)
        totalRecords = 0;

    let filters = {};

    if (req.params.type == 'unarchive') {
        // show only unarchive banks
        filters.isArchive = false
    } else if (req.params.type == 'archive') {
        // show only archive banks
        filters.isArchive = true
    } else {
        filter = {};
    }

    Banks.count(filters).then(count => {
        totalRecords = count;
        Banks.find(filters).skip(offset).limit(limit).sort({ createdAt: -1 }).then(bankList => {
            let banksTosend = bankList;
            responseModule.successResponse(res, {
                success: 1,
                message: 'Banks fetched successfully  .',
                data: {
                    banks: banksTosend,
                    totalRecords: totalRecords
                }
            });
        }).catch(err => {
            return next(err);
        })
    })
};

/* save bank */
let createBank = (req, res, next) => {

    winston.info('***************** saveBank method starts! ***********************');
    winston.info(' Request Body => ', req.body);

    const bankCode = _.trim(req.body.bankCode),
        bankName = _.trim(req.body.bankName).toLowerCase(),
        isArchive = _.trim(req.body.isArchive)

    let bankObject = {
        bankCode: bankCode,
        bankName: bankName,
        isArchive: isArchive
    }

    return Banks.findOne({ $or: [{ 'bankName': bankName }, { 'bankCode': bankCode }] }).then(bankFound => {
        if (bankFound) {
            throw { msgCode: 11002 };
        } else {
            return new Banks(bankObject).save();
        }
    }).then(bankData => {
        return responseModule.successResponse(res, {
            success: 1,
            message: "Bank created successfully.",
            data: { bank: bankData }
        });
    }).catch(err => {
        return next(err);
    });
}

/* update bank */
let updateBank = (req, res, next) => {

    winston.info('***************** update Bank method starts! ***********************');
    winston.info(' Request Body => ', req.body);

    const bankCode = _.trim(req.body.bankCode),
          bankName = _.trim(req.body.bankName).toLowerCase()

    Banks.find({ $or: [{ 'bankName': bankName }, { 'bankCode': bankCode }] }).then(bankFound => {

        // if user tries to add existing code or bank name
        if (bankFound.length >= 1) {
            bankFound.forEach(element => {
                if (element.id != req.body._id) {
                    // if there are more than one result having same code and bank name
                    throw { msgCode: 11002 };
                } else {
                    // if user does not change anything and update itself
                    callUpdateBank(req)
                    .then((data) => {
                        return responseModule.successResponse(res, {
                            success: 1,
                            message: 'Bank info changed successfully.',
                            data: { bankCallSuccess: data.bankCallSuccess }
                        });
                    })
                }
            });
        } else {
            callUpdateBank(req)
            .then((data) => {
                return responseModule.successResponse(res, {
                    success: 1,
                    message: 'Bank info changed successfully.',
                    data: { bankCallSuccess: data.bankCallSuccess }
                });
            })
        }
    }).catch(err => {
        return next(err);
    });
};

/* update bank logic */
let callUpdateBank = (req, res, next) =>{
    let updatedObject = {
        bankCode: _.trim(req.body.bankCode),
        bankName: _.trim(req.body.bankName),
        isArchive: _.trim(req.body.isArchive)
    };

    var success = false;
    let filter = { _id: req.body._id }
    return Banks.findOneAndUpdate(filter, { $set: updatedObject }, { new: true })
        .then(bankCallSuccess => {
            if (bankCallSuccess) {
                return ({ success: true, bankCallSuccess });
            }
            else {
                throw new Error("Not updated")
            }
        })
        .catch(err => {
            throw new Error("Not updated")
        })

}

/* archive or unarchive bank */
let archiveUpdateBank = (req, res, next) =>{
    let updatedObject = {
        isArchive: _.trim(req.body.isArchive)
    };
    var success = false;
    let filter = { _id: req.body._id }
    return Banks.findOneAndUpdate(filter, { $set: updatedObject }, { new: true })
        .then(bankCallSuccess => {
            if (bankCallSuccess) {
                return responseModule.successResponse(res, {
                    success: 1,
                    message: 'Bank info changed successfully.',
                    data: { bankCallSuccess: bankCallSuccess }
                });
            }
            else {
                throw new Error("Not updated")
            }
        })
        .catch(err => {
            throw new Error("Not updated")
        })

}

/* Get single Bank */
let getSingleBank = (req, res, next) => {
    let filters = {
        _id: req.params.bankId
    };
    Banks.findOne(filters)
        .then(result => {
            responseModule.successResponse(res, {
                success: 1,
                message: "Single Bank fetched successfully.",
                data: {
                    bank: result
                }
            });
        }).catch(err => {
            return next(err);
        });
};

/* is valid bank id */
let bankIdVerify = (req, res, next) => {
    let filters = { _id: req.params.bankId }
    Banks.findOne(filters).then(result => {
        responseModule.successResponse(res, {
            success: 1,
            message: "Bank is verified",
        });
    }).catch(err => {
        return next(err);
    })
}

module.exports = {
    getBanks,
    createBank,
    updateBank,
    bankIdVerify,
    getSingleBank,
    archiveUpdateBank
};