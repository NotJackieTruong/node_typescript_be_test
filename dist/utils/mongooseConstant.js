"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userPopulationOptions = exports.chatPopulateOptions = exports.messagePopulateOptions = void 0;
exports.messagePopulateOptions = [
    {
        path: 'sender',
        model: 'User',
        select: 'avatar email fullName role',
        populate: {
            path: 'avatar',
            model: 'Avatar',
            select: 'url'
        }
    },
    {
        path: 'reactions.user',
        model: 'User',
        select: 'avatar email fullName role',
        populate: {
            path: 'avatar',
            model: 'Avatar',
            select: 'url'
        }
    },
    {
        path: 'repliesTo',
        model: 'Message',
    }
];
exports.chatPopulateOptions = [
    {
        path: 'members',
        model: 'User',
        populate: {
            path: 'avatar',
            model: 'Avatar',
            select: 'url'
        },
        select: 'avatar email fullName role'
    }
];
exports.userPopulationOptions = [
    {
        path: 'avatar',
        model: 'Avatar',
        select: 'email role fullName avatar url'
    }
];
//# sourceMappingURL=mongooseConstant.js.map