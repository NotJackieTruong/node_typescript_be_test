"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const AvatarSchema = new mongoose.Schema({
    url: { type: String, required: true },
    lastEdited: { type: Date, default: new Date(Date.now()) },
});
module.exports = mongoose.model("Avatar", AvatarSchema);
//# sourceMappingURL=avatar.js.map