export {}
const mongoose = require('mongoose')
const messagePopulateOptions = require('../utils/mongooseConstant').messagePopulateOptions


const MessageSchema = new mongoose.Schema({
  chat: {type: mongoose.Types.ObjectId, ref: 'Chat'},
  message: {type: String},
  sender: {type: mongoose.Types.ObjectId, ref: 'User'},
  createdAt: {type: Date, default: new Date(Date.now())},
  lastEdited: {type: Date, default: new Date(Date.now())},
  file: {type: mongoose.Types.ObjectId, ref: 'File', required: false},
  reactions: [{
    user: {type: mongoose.Types.ObjectId, ref: 'User'},
    reaction: {type: String}
  }],
  repliesTo: {type: mongoose.Types.ObjectId, ref: 'User', required: false}
})

MessageSchema.index({createdAt: -1})

// populate on pre middleware
MessageSchema.pre('find', function (this: any, next: any) {
  this.populate(messagePopulateOptions)
  next()
})

MessageSchema.pre('findOne', function (this: any, next: any) {
  this.populate(messagePopulateOptions)
  next()
})

MessageSchema.pre('findOneAndUpdate', function (this: any, next: any) {
  this.populate(messagePopulateOptions)
  next()
})

//populate on post middleware
// MessageSchema.post('save', async function (this: any){
//   // this.populate(messagePopulateOptions)
//   await this.model.findById({_id: this._id}).populate(messagePopulateOptions)
// })


module.exports = mongoose.model('Message', MessageSchema)
