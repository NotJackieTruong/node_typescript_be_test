export {}
const Message = require('../models/message')
const Chat = require('../models/chat')
const messagePopulateOptions = require('../utils/mongooseConstant').messagePopulateOptions
let MessageControllers = {}
import {UserType, ChatType, MessageType} from "../utils/CustomTypes";

const getMessages = (chatId: string, options: any = {
  startPage: 0,
  docsPerPage: 10
}): (MessageType[] | any) => {
  try {
    return Message.find({chat: chatId})
      .sort({'createdAt': -1})
      .skip(options.startPage * options.docsPerPage)
      .limit(options.docsPerPage)
  } catch (e) {
    return Promise.reject(e)
  }
}

const createMessage = (message: MessageType): (MessageType | UserType[] | any) => {
  try {
    let getMembers = Chat.findOne({_id: message.chat}).select('members')
    let createMessage = new Message(message).save()
    // let getRepliedMessage = Message.findOne({_id: message.repliesTo})
    return Promise.all([createMessage, getMembers]).then(async results => {
      let message = await results[0]?.populate(messagePopulateOptions).execPopulate()
      let members = results[1]?.members ?? []
      return {message, members}
    })
  } catch (e) {
    return Promise.reject(e)
  }
}

const updateMessage = (chatId: string, messageId: string, reactions: any): (MessageType | UserType[] | any) => {
  try {
    let getMembers = Chat.findOne({_id: chatId}).select('members')
    let updateMessage = Message.findOneAndUpdate({_id: messageId}, {
      $set: {reactions}
    }, {new: true})

    return Promise.all([updateMessage, getMembers]).then(results => {
      let message = results[0]
      let members = results[1]?.members ?? []
      return {message, members}
    })
  } catch (e) {
    return Promise.reject(e)
  }
}

MessageControllers = {
  getMessages, createMessage, updateMessage
}

module.exports = MessageControllers
