export {}
const User = require('../models/user')
const Chat = require('../models/chat')
const Message = require('../models/message')

export type UserType = typeof User
export type ChatType = typeof Chat
export type MessageType = typeof Message

