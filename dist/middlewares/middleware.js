"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let Middlewares = {};
const Utils = require('../utils/utils');
const checkAuth = (req, res, next) => {
    try {
        const body = req.body;
        let accessToken = "";
        if (req.headers && req.headers['authorization'] && req.headers['authorization'].split('Bearer ')[1]) {
            accessToken = req.headers['authorization'].split('Bearer ')[1];
            console.log("Access Token in authorization header");
        }
        else if (req.headers.cookie && req.headers.cookie["access_token"] && req.headers.cookie.split('access_token=')[1]) {
            accessToken = req.headers.cookie.split('access_token=')[1];
            console.log("Access Token in cookie");
        }
        let decodedToken = Utils.verifyJwt(accessToken);
        if (!decodedToken && JSON.stringify(decodedToken) === "{}") {
            res.redirect('/login');
        }
        else {
            res.locals.decodedToken = decodedToken;
            res.locals.accessToken = accessToken;
            res.cookie('access_token', accessToken, { httpOnly: false });
            next();
        }
    }
    catch (e) {
        res.send({
            message: "Error while checking authorization: " + e,
            success: false,
            data: {}
        });
    }
};
const checkIsAdmin = (req, res, next) => {
    try {
        const decodedToken = res.locals.decodedToken;
        console.log(decodedToken);
        if (decodedToken.role !== 'user') {
            next();
        }
        else {
            res.send({
                message: 'Your role is not supported this endpoint!',
                success: false,
                data: {}
            });
        }
    }
    catch (e) {
        res.send({
            message: "Error while checking is admin: " + e,
            success: false,
            data: {}
        });
    }
};
const validate = (req, res, next) => {
};
Middlewares = {
    checkAuth, checkIsAdmin
};
module.exports = Middlewares;
//# sourceMappingURL=middleware.js.map