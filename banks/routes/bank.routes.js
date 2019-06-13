/**
 * Created by Usman on 7/31/2018.
 */


const bankMiddleWare = require('../middlewares/bank.middleware'),
    bankController = require('../controller/bank.controller'),
    passport = require('../../../../../config/passport');

module.exports = (app, version) => {
    app.get(version + '/admin/get/banks/:offset/:limit',
        passport.isAuthenticated,
        bankController.getBanks
    );

    app.get(version + '/admin/get/banks/:type',
        passport.isAuthenticated,
        bankController.getBanks
    );

    app.post(
        version + '/admin/create/bank',
        passport.isAuthenticated,
        passport.isAuthorized('Admin'),
        bankMiddleWare.validateBankParams,
        bankController.createBank
    );

    app.put(
        version + '/admin/update/bank',
        passport.isAuthenticated,
        passport.isAuthorized('Admin'),
        bankMiddleWare.validateBankParams,
        bankController.updateBank
    ),
    app.put(
        version + '/admin/archive/update/bank',
        passport.isAuthenticated,
        passport.isAuthorized('Admin'),
        bankController.archiveUpdateBank
    ),

    app.get(
        version + '/admin/bankIdVerify/:bankId',
        passport.isAuthenticated,
        bankController.bankIdVerify
    )

    app.get(
        version + '/admin/get/singleBank/:bankId',
        passport.isAuthenticated,
        bankController.getSingleBank
    );


}