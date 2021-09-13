"use strict";
const mongoose = require('mongoose');
const Utils = require('../utils/utils');
const userPopulateOptions = require('../utils/mongooseConstant').userPopulationOptions;
const validateEmail = (email) => {
    let regEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regEx.test(email);
};
const validatePassword = (password) => {
    let regEx = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/;
    return regEx.test(password);
};
const UserSchema = new mongoose.Schema({
    avatar: { type: mongoose.Types.ObjectId, required: false, ref: 'Avatar' },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fullName: { type: String },
    email: { type: String, required: true, validate: [validateEmail, 'Please fill a valid email address'] },
    password: {
        type: String,
        required: true,
        maxLength: 25,
        minLength: 4,
    },
    // gender: {type: String, enum: ['male', 'female', 'other'], required: true},
    role: { type: String, enum: ['admin', 'user', 'moderator'], default: "user", required: true }
});
UserSchema.index({ email: 1, });
UserSchema.pre('save', function () {
    this.fullName = this.firstName + " " + this.lastName;
});
UserSchema.pre('findOne', function (next) {
    this.populate(userPopulateOptions);
    next();
});
UserSchema.pre('find', function (next) {
    this.populate(userPopulateOptions);
    next();
});
Utils.queryTime(UserSchema, 'find');
Utils.queryTime(UserSchema, 'findOne');
module.exports = mongoose.model('User', UserSchema);
//# sourceMappingURL=user.js.map