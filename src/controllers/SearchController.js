const Game = require('../models/Game');

module.exports = { 
    async searchUserGames(req, res) {
        const { dev } = req.query;
        const games = await Game.find({dev});
        return res.send(games);
    },
    
    async homepageGames(req, res) {
        const mostDownloaded = await Game.find({ analysed: true }, 'name images _id').sort({ downloads: 'desc' }).limit(9);
        const recentlyAdded = await Game.find({ analysed: true }, 'name images _id').sort({ createdAt: 'desc' }).limit(10);
        return res.send({ mostDownloaded, recentlyAdded });
    },

    async searchGames(req, res) {
        const params = { ...req.query };
        const results = {};
        const fields = 'name images _id rating launchDate'
        const queries = {
            1: await Game.find({ name: { $regex: '.*' + params.name + '.*' } , categories: { $all: params.categories } }, fields).sort({ [params.order]: 'desc' }),
            2: await Game.find({ categories: { $all: params.categories } }, fields).sort({ [params.order]: 'desc' }),
            3: await Game.find({ name: { $regex: '.*' + params.name + '.*' } }, fields).sort({ [params.order]: 'desc' }),
            4: await Game.find({}, fields).sort({ [params.order]: 'desc' })
        }
        if(params.name) {
            if(params.categories) {
                results.games = (queries[1]);
            }else {
                results.games = (queries[3]);
            }
        }else if (params.categories) {
            results.games = (queries[2]);
        }else {
            results.games = (queries[4]);
        }
        
        return res.send(results)
    },

    async searchGamesForInspection(req, res) {
        const {moderator} = req;
        if(!moderator) {
            return res.send({message: 'Permissão negada'});
        }   
        const games = await Game.find({analysed: false});
        return res.send(games);
    }
}