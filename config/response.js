
"use strict"; // NOSONAR
const errors = require('./errors');

let successResponse = (res, data) => {
    data.response = 200;
    res.json(data);
};

let errorResponse = (res, err) => {

    res.json({
        success: 0,
        data: {},
        message: err,
        response: 304
    });

};

let errorResponseWithData = (req, res, err, data) => {
    res.json({
        success: 0,
        message: errors[err.msgCode].msg.EN,
        response: 400,
        data: data
    });
};

module.exports = {
    successResponse,
    errorResponse,
    errorResponseWithData
};
