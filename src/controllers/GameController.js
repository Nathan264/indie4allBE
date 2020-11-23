const User = require('../models/User');
const Game = require('../models/Game');
const fs = require('fs');

module.exports = {
    async loadGame(req, res) {
        const { name } = req.query;
        const game = await Game.findOne({
            name,
        }, '-createdAt -updatedAt').populate('dev', 'username userImage -_id').populate('comments.user', 'username userImage -_id');
        
        if(!game.analysed) {
            const {username} = req.query;
            if(username === undefined) {
                return res.send({message: 'Este jogo está em análise e não pode ser acessado ainda'});
            }
            const user = await User.findOne({username}, 'moderator');
            if(!user.moderator) {
                return res.send({message: 'Este jogo está em análise e não pode ser acessado ainda'});
            }
        }

        return res.send(game)
    },

    async addgame(req, res) {
        const { imgs, gameFile } = req.files;
        const gameData = JSON.parse(req.body.gameData);
        const images = [];
        const categories = gameData.categories.split(',');

        const checkName = await Game.find({
            name: gameData.name
        });

        if(checkName.length === 1) {
            imgs.map(item => {
                fs.unlink(`${__dirname}/../../${item.path}`, ()=>{});
            });
            fs.unlink(`${__dirname}/../../${gameFile[0].path}`, ()=>{});
            return res.send({message: 'Já existe um jogo usando este nome'});
        }

        imgs.map(item => {
            fs.rename(`${__dirname}/../../${item.path}`, `${__dirname}/../../uploads/images/${item.filename}`, () => {});
            images.push(item.filename);
        });
        fs.rename(`${__dirname}/../../${gameFile[0].path}`, `${__dirname}/../../uploads/games/${gameFile[0].filename}`, ()=>{});
        const newGame = await Game.create({
            name: gameData.name,
            sinopse: gameData.sinopse,
            categories,
            dev: gameData.dev,
            reqMin: {
                cpu: gameData.reqMin.cpu,
                gpu: gameData.reqMin.gpu,
                storage: gameData.reqMin.storage,
                so: gameData.reqMin.so,
                ram: gameData.reqMin.ram
            },
            reqRec: {
                cpu: gameData.reqRec.cpu,
                gpu: gameData.reqRec.gpu,
                storage: gameData.reqRec.storage,
                so: gameData.reqRec.so,
                ram: gameData.reqRec.ram
            },
            images,
            archive: gameFile[0].filename
        });
        
        return res.send({message: 'Jogo cadastrado com sucesso, após passar pela fase de análise o jogo será liberado para download'});   
    },

    async altGameStatus(req, res) {
        const {status, name} = req.body;
        const {moderator} = req;
        if(!moderator) {
            return res.send({message: 'Permissão negada para concluir a operação'});
        }
        const altGame = await Game.updateOne({
            name
        }, {
            analysed: status
        });

        res.send(altGame)
    },

    async altInfoGame(req, res) {
        const {_id} = req.query;
        const images = [];

        if(req.files.imgs) {
            req.files.imgs.map(item => {
                fs.rename(`${__dirname}/../../${item.path}`, `${__dirname}/../../uploads/images/${item.filename}`, () => {});
                images.push(item.filename);
            });
        }
        
        const gameData = JSON.parse(req.body.gameData);

        if(req.files.gameFile) {
            gameData.archive = req.files.gameFile[0].filename;
            fs.rename(`${__dirname}/../../${req.files.gameFile[0].path}`, `${__dirname}/../../uploads/games/${req.files.gameFile[0].filename}`, ()=>{}); 
        }

        const game = await Game.findOneAndUpdate({_id}, {...gameData, $push: { images }});

        if(req.files.gameFile) {
            console.log(game.archive);
            console.log(gameData.archive)
            fs.unlink(`${__dirname}/../../uploads/games/${game.archive}`, ()=>{});
        }

        return res.send(game)
    },

    async removeImg(req, res) {
        const {id, img} = req.query;
        const game = await Game.findById(id, 'images');
        game.images.map((item, index) => {
            if(item === img) {
                const removedImg = game.images.splice(index, 1);
                fs.unlink(`${__dirname}/../../uploads/images/${removedImg}`, ()=>{});
            }
        });
        game.save();
        return res.send({message: 'Imagem removida com sucesso'});
    },

    async removeGame(req, res) {
        const {id} = req.query;
        await Game.deleteOne({_id: id});
        return res.send({message: 'Jogo deletado com sucesso'});
    },

    async addVisitOrDownload(req, res) {
        const { downloaded, id } = req.body;
        const game = await Game.findById(id, 'downloads');
        if(downloaded) {
            game.downloads++;
            game.save();
        }
        return res.send('ok')
    }
}