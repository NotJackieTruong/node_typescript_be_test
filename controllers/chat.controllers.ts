export {}
const Chat = require('../models/chat')
const Message = require('../models/message')
let ChatControllers = {}
import {UserType, ChatType, MessageType} from "../utils/CustomTypes";

const createChat = (members: UserType[]): ChatType => {
  try {
    let newChat = {
      name: members.map((item: any = {}) => item.fullName).join(', '),
      members: members.map((item: any = {}) => item._id),
    }
    return new Chat(newChat).save()

  } catch (e) {
    console.log("Error while creating a chat: ", e)
    return Promise.reject(e)
  }
}

const getChat = (req: any, res: any) => {
  try {
    const id = req.params.id
    Chat.findOne({_id: id}).then((chat: any) => {
      res.send({
        message: "Found 1 chat",
        success: true,
        data: {chat}
      })
    })
  } catch (e) {
    res.send({
      message: e,
      success: false,
      data: {}
    })
  }
}

const getChats = (userId: string, options: any = {startPage: 0, docsPerPage: 10}): (ChatType[] | any) => {
  try {
    return Chat.find({members: {$all: [userId]}})
      .skip(options.startPage * options.docsPerPage)
      .limit(options.docsPerPage)
  } catch (e) {
    return Promise.reject(e)
  }
}

const deleteChat = async (chatId: string) => {
  try {
    let deleteChat = Chat.findOneAndDelete({_id: chatId})
    let deleteMessages = Message.deleteMany({chat: chatId})
    // let deleteChat = Chat.findOne({_id: chatId})
    // let deleteMessages = Message.find({chat: chatId})

    return Promise.all([deleteChat, deleteMessages]).then((results: any) => {
      let chat = results[0]
      let messages = results[1]
      return {chat, messages}
    })
  } catch (e) {
    return Promise.reject(e)
  }
}

ChatControllers = {
  createChat, getChat, getChats, deleteChat
}

module.exports = ChatControllers
