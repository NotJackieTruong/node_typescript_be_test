"use strict";
const express = require('express');
const Middlewares = require('../middlewares/middleware');
let router = express.Router();
let UserController = require('../controllers/user.controlers');
let ChatController = require('../controllers/chat.controllers');
router.get('/', (req, res) => {
    res.send('Home page');
});
router.get('/signup', (req, res) => {
    res.send('Sign up page');
});
router.get('/login', (req, res) => {
    res.send("Login page");
});
router.post('/signup', UserController.signup);
router.post('/login', UserController.login);
router.get('/users/me', Middlewares.checkAuth, UserController.getMe);
router.put('/users/:id', Middlewares.checkAuth, UserController.updateUser);
router.get('/search', UserController.search);
router.get('/users', Middlewares.checkAuth, UserController.getUsers);
router.get('/private/:id', Middlewares.checkAuth, UserController.privateRoute);
router.get('/create-fake-data', UserController.createFakeData);
// chat
// router.post('/chats', Middlewares.checkAuth, ChatController.createChat)
//
// router.get('/chats/:id', Middlewares.checkAuth, ChatController.getChat)
//
// router.get('/chats', Middlewares.checkAuth, ChatController.getChats)
module.exports = router;
//# sourceMappingURL=index.js.map