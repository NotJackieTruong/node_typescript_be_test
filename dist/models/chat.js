"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const Utils = require('../utils/utils');
const chatPopulateOptions = require('../utils/mongooseConstant').chatPopulateOptions;
const ChatSchema = new mongoose.Schema({
    name: { type: String, required: true },
    createdAt: { type: Date, required: true, default: new Date(Date.now()) },
    members: [{
            type: mongoose.Types.ObjectId, ref: 'User'
        }],
    avatar: { type: mongoose.Types.ObjectId, ref: 'Avatar', required: false }
});
Utils.queryTime(ChatSchema, 'find');
Utils.queryTime(ChatSchema, 'findOne');
ChatSchema.index({ createAt: -1 });
// populate on pre middleware
ChatSchema.pre('findOne', function (next) {
    this.populate(chatPopulateOptions);
    next();
});
ChatSchema.pre('find', function (next) {
    this.populate(chatPopulateOptions);
    next();
});
ChatSchema.pre('findOneAndUpdate', function (next) {
    this.populate(chatPopulateOptions);
    next();
});
//populate on post middleware
module.exports = mongoose.model('Chat', ChatSchema);
//# sourceMappingURL=chat.js.map