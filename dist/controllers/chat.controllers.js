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
const Chat = require('../models/chat');
const Message = require('../models/message');
let ChatControllers = {};
const createChat = (members) => {
    try {
        let newChat = {
            name: members.map((item = {}) => item.fullName).join(', '),
            members: members.map((item = {}) => item._id),
        };
        return new Chat(newChat).save();
    }
    catch (e) {
        console.log("Error while creating a chat: ", e);
        return Promise.reject(e);
    }
};
const getChat = (req, res) => {
    try {
        const id = req.params.id;
        Chat.findOne({ _id: id }).then((chat) => {
            res.send({
                message: "Found 1 chat",
                success: true,
                data: { chat }
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
};
const getChats = (userId, options = { startPage: 0, docsPerPage: 10 }) => {
    try {
        return Chat.find({ members: { $all: [userId] } })
            .skip(options.startPage * options.docsPerPage)
            .limit(options.docsPerPage);
    }
    catch (e) {
        return Promise.reject(e);
    }
};
const deleteChat = (chatId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let deleteChat = Chat.findOneAndDelete({ _id: chatId });
        let deleteMessages = Message.deleteMany({ chat: chatId });
        // let deleteChat = Chat.findOne({_id: chatId})
        // let deleteMessages = Message.find({chat: chatId})
        return Promise.all([deleteChat, deleteMessages]).then((results) => {
            let chat = results[0];
            let messages = results[1];
            return { chat, messages };
        });
    }
    catch (e) {
        return Promise.reject(e);
    }
});
ChatControllers = {
    createChat, getChat, getChats, deleteChat
};
module.exports = ChatControllers;
//# sourceMappingURL=chat.controllers.js.map