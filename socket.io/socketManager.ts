import {Socket} from "socket.io";

export {}
const CONSTANTS = require('../utils/constants')
const ChatControllers = require('../controllers/chat.controllers')
const MessageControllers = require('../controllers/message.controllers')
const UserControllers = require('../controllers/user.controlers')
import {UserType, ChatType, MessageType} from "../utils/CustomTypes";

const socketManager = (socket: Socket, io: any) => {
  let sockets = io.sockets.sockets
  let activeUsers: UserType[] = sockets.activeUsers || []

  const getThisUserId = () => {
    let thisUserId = Object.keys(sockets).find(key => sockets[key] === socket.id) || ""
    return thisUserId
  }


  socket.on('connect', () => {
    console.log("Connect: ", socket.id)
  })

  socket.on(CONSTANTS.CONNECTED, (user: UserType) => {
    if (activeUsers.findIndex((i: UserType) => i._id === user._id) < 0) {
      activeUsers.unshift(user)
    }
    sockets[user._id] = socket.id
    sockets["activeUsers"] = activeUsers
  })

  socket.on(CONSTANTS.LOG_IN, (data: UserType) => {
    console.log({activeUsers})
    let index = activeUsers.findIndex((item: UserType) => item._id === data._id)
    if (index < 0) {
      activeUsers.unshift(data)
    }
    io.emit(CONSTANTS.LOG_IN, activeUsers)

  })

  socket.on(CONSTANTS.LOG_OUT, (data: UserType) => {
    activeUsers = activeUsers.filter((item: UserType) => item._id !== data._id)
    io.emit(CONSTANTS.LOG_OUT, activeUsers)

  })

  socket.on(CONSTANTS.GET_ACTIVE_USERS, () => {
    io.emit(CONSTANTS.GET_ACTIVE_USERS, activeUsers)
  })

  socket.on(CONSTANTS.CREATE_NEW_CHAT, (members: UserType[], options: any = {startPage: 0, docsPerPage: 10}) => {
    const socketArray: string[] = members.map((user: UserType) => io.sockets.sockets[user._id])
    console.log({socketArray})

    ChatControllers.createChat(members).then((chat: ChatType) => {
      console.log({chat})
      io.to(socketArray).emit(CONSTANTS.CREATE_NEW_CHAT, chat)
    }).catch((error: any) => {
      console.log("Error: ", error)
      io.to(socketArray).emit(CONSTANTS.ERROR, error)

    })
  })

  socket.on(CONSTANTS.GET_CHATS, async (options: any = {startPage: 0, docsPerPage: 10}) => {
    let thisUserId = getThisUserId()
    const socketId = io.sockets.sockets[thisUserId]
    await ChatControllers.getChats(thisUserId, options).then((chats: ChatType[]) => {
      io.to(socketId).emit(CONSTANTS.GET_CHATS, chats)
    }).catch((error: any) => {
      io.to(socketId).emit(CONSTANTS.ERROR, error)
    })

  })

  socket.on(CONSTANTS.GET_CURRENT_CHAT_MESSAGES, async (chatId: string, options: any = {
    startPage: 0,
    docsPerPage: 20
  }) => {
    let thisUserId = getThisUserId()
    const socketId = io.sockets.sockets[thisUserId]
    await MessageControllers.getMessages(chatId, options).then((messages: MessageType[]) => {
      messages = messages.sort((a: MessageType, b: MessageType) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      io.to(socketId).emit(CONSTANTS.GET_CURRENT_CHAT_MESSAGES, messages)
    }).catch((error: any) => {
      io.to(socketId).emit(CONSTANTS.ERROR, error)

    })
  })

  socket.on(CONSTANTS.SEND_MESSAGE, (message: MessageType) => {
    let thisUserId = getThisUserId()
    const socketId = io.sockets.sockets[thisUserId]
    MessageControllers.createMessage(message).then((results: (UserType[] | MessageType)) => {
      let {message, members} = results
      let socketIds = members.map((item: UserType) => sockets[item._id])
      io.to(socketIds).emit(CONSTANTS.SEND_MESSAGE, message)
    }).catch((error: any) => {
      io.to(socketId).emit(CONSTANTS.ERROR, error)

    })
  })

  socket.on(CONSTANTS.LOAD_MORE_MESSAGES, async (chatId: string, options: any = {
    startPage: 0,
    docsPerPage: 10
  }) => {
    let thisUserId = getThisUserId()
    const socketId = io.sockets.sockets[thisUserId]
    await MessageControllers.getMessages(chatId, options).then((messages: MessageType[]) => {
      messages = messages.sort((a: MessageType, b: MessageType) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      io.to(socketId).emit(CONSTANTS.LOAD_MORE_MESSAGES, messages)
    }).catch((error: any) => {
      io.to(socketId).emit(CONSTANTS.ERROR, error)
    })
  })

  socket.on(CONSTANTS.REACT_MESSAGE, async (data: any) => {
    let thisUserId = getThisUserId()
    const socketId = io.sockets.sockets[thisUserId]
    let messageId = data.messageId
    let chatId = data.chatId
    let reactions = data.reactions
    await MessageControllers.updateMessage(chatId, messageId, reactions).then((results: (MessageType | UserType[])) => {
      let {message, members} = results
      let socketIds = members.map((item: UserType) => sockets[item._id])
      io.to(socketIds).emit(CONSTANTS.REACT_MESSAGE, message)
    }).catch((error: any) => {
      io.to(socketId).emit(CONSTANTS.ERROR, error)

    })
  })

  socket.on(CONSTANTS.UPDATE_USER_PROFILE_IMAGE, async (data: any) => {
    let thisUserId = getThisUserId()
    const socketId = io.sockets.sockets[thisUserId]
    UserControllers.updateUserProfileImage(data).then((results: (UserType | any)) => {
      io.to(socketId).emit(CONSTANTS.UPDATE_USER_PROFILE_IMAGE)
    }).catch((error: any) => {
      io.to(socketId).emit(CONSTANTS.ERROR, error)

    })
  })

  socket.on(CONSTANTS.DELETE_CHAT, async (chatId: string) => {
    let thisUserId = getThisUserId()
    const socketId = io.sockets.sockets[thisUserId]
    // let callback = (chatId: string, error: any) => {
    //   if (!error) {
    //     io.to(socketId).emit(CONSTANTS.UPDATE_USER_PROFILE_IMAGE)
    //     return
    //   }
    //   io.to(socketId).emit(CONSTANTS.ERROR, error)
    // }
    await ChatControllers.deleteChat(chatId).then((results: any) => {
      let {chat, messages} = results
      let socketIds = chat.members.map((item: UserType) => sockets[item._id])
      // console.log({chat, messages, socketIds})
      io.to(socketIds).emit(CONSTANTS.DELETE_CHAT, chat._id, messages)
    }).catch((error: any) => {
      console.log("Error while delete a chat: ", error)
    })
  })

}

module.exports = socketManager
