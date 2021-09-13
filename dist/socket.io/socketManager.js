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
const CONSTANTS = require('../utils/constants');
const ChatControllers = require('../controllers/chat.controllers');
const MessageControllers = require('../controllers/message.controllers');
const UserControllers = require('../controllers/user.controlers');
const socketManager = (socket, io) => {
    let sockets = io.sockets.sockets;
    let activeUsers = sockets.activeUsers || [];
    const getThisUserId = () => {
        let thisUserId = Object.keys(sockets).find(key => sockets[key] === socket.id) || "";
        return thisUserId;
    };
    socket.on('connect', () => {
        console.log("Connect: ", socket.id);
    });
    socket.on(CONSTANTS.CONNECTED, (user) => {
        if (activeUsers.findIndex((i) => i._id === user._id) < 0) {
            activeUsers.unshift(user);
        }
        sockets[user._id] = socket.id;
        sockets["activeUsers"] = activeUsers;
    });
    socket.on(CONSTANTS.LOG_IN, (data) => {
        console.log({ activeUsers });
        let index = activeUsers.findIndex((item) => item._id === data._id);
        if (index < 0) {
            activeUsers.unshift(data);
        }
        io.emit(CONSTANTS.LOG_IN, activeUsers);
    });
    socket.on(CONSTANTS.LOG_OUT, (data) => {
        activeUsers = activeUsers.filter((item) => item._id !== data._id);
        io.emit(CONSTANTS.LOG_OUT, activeUsers);
    });
    socket.on(CONSTANTS.GET_ACTIVE_USERS, () => {
        io.emit(CONSTANTS.GET_ACTIVE_USERS, activeUsers);
    });
    socket.on(CONSTANTS.CREATE_NEW_CHAT, (members, options = { startPage: 0, docsPerPage: 10 }) => {
        const socketArray = members.map((user) => io.sockets.sockets[user._id]);
        console.log({ socketArray });
        ChatControllers.createChat(members).then((chat) => {
            console.log({ chat });
            io.to(socketArray).emit(CONSTANTS.CREATE_NEW_CHAT, chat);
        }).catch((error) => {
            console.log("Error: ", error);
            io.to(socketArray).emit(CONSTANTS.ERROR, error);
        });
    });
    socket.on(CONSTANTS.GET_CHATS, (options = { startPage: 0, docsPerPage: 10 }) => __awaiter(void 0, void 0, void 0, function* () {
        let thisUserId = getThisUserId();
        const socketId = io.sockets.sockets[thisUserId];
        yield ChatControllers.getChats(thisUserId, options).then((chats) => {
            io.to(socketId).emit(CONSTANTS.GET_CHATS, chats);
        }).catch((error) => {
            io.to(socketId).emit(CONSTANTS.ERROR, error);
        });
    }));
    socket.on(CONSTANTS.GET_CURRENT_CHAT_MESSAGES, (chatId, options = {
        startPage: 0,
        docsPerPage: 20
    }) => __awaiter(void 0, void 0, void 0, function* () {
        let thisUserId = getThisUserId();
        const socketId = io.sockets.sockets[thisUserId];
        yield MessageControllers.getMessages(chatId, options).then((messages) => {
            messages = messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            io.to(socketId).emit(CONSTANTS.GET_CURRENT_CHAT_MESSAGES, messages);
        }).catch((error) => {
            io.to(socketId).emit(CONSTANTS.ERROR, error);
        });
    }));
    socket.on(CONSTANTS.SEND_MESSAGE, (message) => {
        let thisUserId = getThisUserId();
        const socketId = io.sockets.sockets[thisUserId];
        MessageControllers.createMessage(message).then((results) => {
            let { message, members } = results;
            let socketIds = members.map((item) => sockets[item._id]);
            io.to(socketIds).emit(CONSTANTS.SEND_MESSAGE, message);
        }).catch((error) => {
            io.to(socketId).emit(CONSTANTS.ERROR, error);
        });
    });
    socket.on(CONSTANTS.LOAD_MORE_MESSAGES, (chatId, options = {
        startPage: 0,
        docsPerPage: 10
    }) => __awaiter(void 0, void 0, void 0, function* () {
        let thisUserId = getThisUserId();
        const socketId = io.sockets.sockets[thisUserId];
        yield MessageControllers.getMessages(chatId, options).then((messages) => {
            messages = messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            io.to(socketId).emit(CONSTANTS.LOAD_MORE_MESSAGES, messages);
        }).catch((error) => {
            io.to(socketId).emit(CONSTANTS.ERROR, error);
        });
    }));
    socket.on(CONSTANTS.REACT_MESSAGE, (data) => __awaiter(void 0, void 0, void 0, function* () {
        let thisUserId = getThisUserId();
        const socketId = io.sockets.sockets[thisUserId];
        let messageId = data.messageId;
        let chatId = data.chatId;
        let reactions = data.reactions;
        yield MessageControllers.updateMessage(chatId, messageId, reactions).then((results) => {
            let { message, members } = results;
            let socketIds = members.map((item) => sockets[item._id]);
            io.to(socketIds).emit(CONSTANTS.REACT_MESSAGE, message);
        }).catch((error) => {
            io.to(socketId).emit(CONSTANTS.ERROR, error);
        });
    }));
    socket.on(CONSTANTS.UPDATE_USER_PROFILE_IMAGE, (data) => __awaiter(void 0, void 0, void 0, function* () {
        let thisUserId = getThisUserId();
        const socketId = io.sockets.sockets[thisUserId];
        UserControllers.updateUserProfileImage(data).then((results) => {
            io.to(socketId).emit(CONSTANTS.UPDATE_USER_PROFILE_IMAGE);
        }).catch((error) => {
            io.to(socketId).emit(CONSTANTS.ERROR, error);
        });
    }));
    socket.on(CONSTANTS.DELETE_CHAT, (chatId) => __awaiter(void 0, void 0, void 0, function* () {
        let thisUserId = getThisUserId();
        const socketId = io.sockets.sockets[thisUserId];
        // let callback = (chatId: string, error: any) => {
        //   if (!error) {
        //     io.to(socketId).emit(CONSTANTS.UPDATE_USER_PROFILE_IMAGE)
        //     return
        //   }
        //   io.to(socketId).emit(CONSTANTS.ERROR, error)
        // }
        yield ChatControllers.deleteChat(chatId).then((results) => {
            let { chat, messages } = results;
            let socketIds = chat.members.map((item) => sockets[item._id]);
            // console.log({chat, messages, socketIds})
            io.to(socketIds).emit(CONSTANTS.DELETE_CHAT, chat._id, messages);
        }).catch((error) => {
            console.log("Error while delete a chat: ", error);
        });
    }));
};
module.exports = socketManager;
//# sourceMappingURL=socketManager.js.map