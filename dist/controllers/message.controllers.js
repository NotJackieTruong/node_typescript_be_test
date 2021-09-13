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
const Message = require('../models/message');
const Chat = require('../models/chat');
const messagePopulateOptions = require('../utils/mongooseConstant').messagePopulateOptions;
let MessageControllers = {};
const getMessages = (chatId, options = {
    startPage: 0,
    docsPerPage: 10
}) => {
    try {
        return Message.find({ chat: chatId })
            .sort({ 'createdAt': -1 })
            .skip(options.startPage * options.docsPerPage)
            .limit(options.docsPerPage);
    }
    catch (e) {
        return Promise.reject(e);
    }
};
const createMessage = (message) => {
    try {
        let getMembers = Chat.findOne({ _id: message.chat }).select('members');
        let createMessage = new Message(message).save();
        // let getRepliedMessage = Message.findOne({_id: message.repliesTo})
        return Promise.all([createMessage, getMembers]).then((results) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c;
            let message = yield ((_a = results[0]) === null || _a === void 0 ? void 0 : _a.populate(messagePopulateOptions).execPopulate());
            let members = (_c = (_b = results[1]) === null || _b === void 0 ? void 0 : _b.members) !== null && _c !== void 0 ? _c : [];
            return { message, members };
        }));
    }
    catch (e) {
        return Promise.reject(e);
    }
};
const updateMessage = (chatId, messageId, reactions) => {
    try {
        let getMembers = Chat.findOne({ _id: chatId }).select('members');
        let updateMessage = Message.findOneAndUpdate({ _id: messageId }, {
            $set: { reactions }
        }, { new: true });
        return Promise.all([updateMessage, getMembers]).then(results => {
            var _a, _b;
            let message = results[0];
            let members = (_b = (_a = results[1]) === null || _a === void 0 ? void 0 : _a.members) !== null && _b !== void 0 ? _b : [];
            return { message, members };
        });
    }
    catch (e) {
        return Promise.reject(e);
    }
};
MessageControllers = {
    getMessages, createMessage, updateMessage
};
module.exports = MessageControllers;
//# sourceMappingURL=message.controllers.js.map