export {}
const express = require('express')
const http = require('http')
const router = require('./routes/index')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const os = require('os')
const mongoose = require('mongoose')
const Utils = require('./utils/utils')
const session = require('express-session')
const cors = require('cors')
const socket = require('socket.io')
const path = require('path')
const socketManager = require('./socket.io/socketManager')

require('dotenv').config()

const app = express()
const server = http.createServer(app)
const networkInterfaces = os.networkInterfaces()

const ipAddress = Utils.getIpAddress(networkInterfaces)
const port = process.env.PORT||3000
const mongooseUrl = process.env.MONGOOSE_CONNECTION_STRING
const serverUrl = `http://${ipAddress}:${port}`
const io = socket(server)

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(function (req: any, res: any, next: any) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  next();
});
app.use(cors())
app.use(router)
app.use(express.static(path.join(__dirname, '../public')))

// heroku
if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname, '../client/build')))
}

// mongoose
mongoose.connect(mongooseUrl, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', (error: any) => {
  console.error(error)
})
db.on('connected', () => {
  console.log('Mongoose connected successfully!')
})

// socket.io
io.on('connection', (socket: any) => {
  socketManager(socket, io)
})

// server
server.listen(port)
server.on('listening', () => {
  console.log('Listening on: ', serverUrl)
})
server.on('error', (error: Object) => {
  console.error(error)
})

module.exports = server
