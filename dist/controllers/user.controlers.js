"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker = require('faker');
const Utils = require('../utils/utils');
const User = require('../models/user');
const Avatar = require('../models/avatar');
const fs = require('fs');
const path = require('path');
let UserController = {};
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        let avatar = yield new Avatar({
            url: body.avatar
        }).save();
        yield new User(Object.assign(Object.assign({}, body), { avatar: avatar._id })).save().then((user) => {
            const token = Utils.generateJwt({
                email: user.email,
                role: user.role,
                fullName: user.fullName,
                avatar: avatar.url,
                _id: user._id
            });
            res.cookie('access_token', token, { httpOnly: false });
            res.send({
                message: 'Create user successfully!',
                success: true,
                data: {
                    token
                }
            });
        }).catch((error) => {
            res.send({
                message: error.message,
                success: false,
                data: {}
            });
        });
    }
    catch (e) {
        res.send({
            message: e,
            success: false,
            data: {}
        });
    }
});
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        User.findOne({
            email: body.email,
            password: body.password
        }).then((user) => {
            if (user) {
                let obj = {
                    email: user.email,
                    role: user.role,
                    fullName: user.fullName,
                    avatar: user.avatar,
                    _id: user._id
                };
                const token = Utils.generateJwt(obj);
                // req.session.user = obj._id
                // req.session.accessToken = token
                res.cookie('access_token', token, { httpOnly: false });
                res.send({
                    message: 'Login successfully!',
                    success: true,
                    data: {
                        accessToken: token,
                        user: obj
                    }
                });
            }
            else {
                res.send({
                    message: "Email or password is invalid!",
                    success: false,
                    data: {}
                });
            }
        });
    }
    catch (e) {
        res.send({
            message: e,
            success: false,
            data: {}
        });
    }
});
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decodedToken = res.locals.decodedToken;
        const accessToken = res.locals.accessToken;
        User.findOne({ _id: decodedToken._id }).populate("avatar", 'url').select("email firstName lastName avatar fullName role").then((user) => {
            res.send({
                message: "Get my account",
                success: true,
                data: {
                    user: user,
                    accessToken
                }
            });
        });
    }
    catch (e) {
        res.send({
            message: e,
            success: false,
            data: {}
        });
    }
});
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const id = req.params.id;
        console.log({ id, body });
        User
            .findOneAndUpdate({ _id: id }, body, { new: true })
            .populate("avatar", 'url')
            .select("email firstName lastName avatar fullName role")
            .then((user) => {
            res.send({
                message: "Update successfully",
                success: true,
                data: {
                    user: Object.assign(Object.assign({}, user._doc), { avatar: user.avatar.url }),
                }
            });
        });
    }
    catch (e) {
        res.send({
            message: e,
            success: false,
            data: {}
        });
    }
});
const search = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queries = req.query;
        const startPage = parseInt(queries.startPage) || 0;
        const docsPerPage = parseInt(queries.docsPerPage) || 5;
        const mongooseQueries = Object.assign({}, queries);
        delete mongooseQueries.startPage;
        delete mongooseQueries.docsPerPage;
        for (let prop in mongooseQueries) {
            mongooseQueries[prop] = (new RegExp(Utils.escapeRegex(mongooseQueries[prop]), 'gi'));
        }
        let totalCountUsers = User.countDocuments(mongooseQueries);
        let foundUsers = User.find(mongooseQueries).select('email name avatar').skip(startPage * docsPerPage).limit(docsPerPage).populate([{
                path: 'avatar',
                model: 'Avatar'
            }]);
        Promise.all([totalCountUsers, foundUsers]).then((results) => {
            const total = results[0];
            const users = results[1];
            res.send({
                message: `Found totally ${total} users`,
                success: true,
                data: {
                    total,
                    users,
                }
            });
        });
    }
    catch (e) {
        res.send({
            message: e,
            success: false,
            data: {}
        });
    }
});
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const startPage = parseInt(req.query.startPage) || 0;
        const docsPerPage = parseInt(req.query.docsPerPage) || 10;
        let totalCountUsers = User.countDocuments({});
        let foundUsers = User.find({}).select('email name avatar').populate([{
                path: 'avatar',
                model: 'Avatar'
            }]).skip(startPage * docsPerPage).limit(docsPerPage);
        Promise.all([totalCountUsers, foundUsers]).then((results) => {
            let total = results[0];
            let users = results[1];
            res.send({
                message: `Found totally ${total} users`,
                success: true,
                data: {
                    total,
                    users
                }
            });
        });
    }
    catch (e) {
        res.send({
            message: e,
            success: false,
            data: {}
        });
    }
});
const privateRoute = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        User.find({ _id: id }).then((users) => {
            res.send({
                message: "Private route",
                success: true,
                data: {
                    users
                }
            });
        });
    }
    catch (e) {
        res.send({
            message: e,
            success: false,
            data: {}
        });
    }
});
const createFakeData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (let i = 0; i < 1000; i++) {
            let avatar = yield new Avatar({
                url: faker.internet.avatar(),
            }).save();
            yield new User({
                avatar: avatar._id,
                name: faker.internet.userName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                gender: ["male", "female", "other"][Math.floor(Math.random() * 3)],
                role: ["admin", "user", "moderator"][Math.floor(Math.random() * 3)],
            }).save();
        }
        res.send({
            message: 'Create 200 users successfully!',
            success: true,
            data: {}
        });
    }
    catch (e) {
        res.send({
            message: e,
            success: false,
            data: {}
        });
    }
});
const updateUserProfileImage = (data) => {
    try {
        let extension = Utils.getFileExtension(data.data);
        let buffer = Utils.convertBase64ToBuffer(data.data);
        let imagePath = path.join(__dirname, `../../public/users/${data._id}.${extension}`);
        fs.writeFile(imagePath, buffer, (err, file) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.log("Error: ", err);
            }
            console.log("File saved: ", file);
            let updateAvatar = Avatar.findOneAndUpdate({ _id: data.avatarId }, { $set: { url: `users/${data._id}.${extension}` } });
            let getUser = User.findOne({ _id: data._id });
            return Promise.all([updateAvatar, getUser]).then((results) => {
                const avatar = results[0];
                const user = results[1];
                return { avatar, user };
            });
        }));
    }
    catch (e) {
        return Promise.reject(e);
    }
};
UserController = {
    signup, login, privateRoute, createFakeData, search, getUsers, getMe, updateUser, updateUserProfileImage
};
module.exports = UserController;
//# sourceMappingURL=user.controlers.js.map