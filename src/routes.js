const express = require('express');
const routes = express.Router();

const GameController = require('./controllers/GameController');
const UserController = require('./controllers/UserController');
const SearchController = require('./controllers/SearchController');
const CommentController = require('./controllers/CommentController');
const AccountController = require('./controllers/AccountController');

const FileMiddleware = require('./middlewares/FileMiddleware');
const AuthMiddleware = require('./middlewares/AuthMiddleware');

routes.get('/', SearchController.homepageGames);
routes.get('/search', SearchController.searchGames);
routes.get('/loadGame', GameController.loadGame);
routes.post('/register', UserController.register);
routes.get('/verifyAccount', AccountController.verifyAccount);
routes.post('/login', UserController.login);
routes.put('/altUserImg', AuthMiddleware, FileMiddleware.imgUser, AccountController.altUserImg);
routes.post('/addGame', AuthMiddleware, FileMiddleware.gameFiles, GameController.addgame);
routes.get('/loadUserGames', AuthMiddleware, SearchController.searchUserGames);
routes.get('/getUserInfo', AuthMiddleware, UserController.getUserInfo);
routes.put('/altUserInfo', AuthMiddleware, AccountController.altInfoUser);
routes.put('/comment', AuthMiddleware, CommentController.makeComment);
routes.put('/altGameStatus', AuthMiddleware, GameController.altGameStatus);
routes.get('/analyzeGames', AuthMiddleware, SearchController.searchGamesForInspection);
routes.put('/altInfoGame', AuthMiddleware, FileMiddleware.gameFiles, GameController.altInfoGame);
routes.delete('/removeImg', AuthMiddleware, GameController.removeImg);
routes.delete('/removeGame', AuthMiddleware, GameController.removeGame);
routes.post('/requestPwdChange', AccountController.requestPwdChange);
routes.put('/changePwd', AccountController.changePwd);
routes.put('/addVisitOrDownload', GameController.addVisitOrDownload);

module.exports = routes;