const Game = require('../models/Game');

module.exports = {
    async makeComment(req, res) {
        const { name, comment } = req.body;
        const game = await Game.updateOne({
            name,
        }, {
            $push: {
                comments: comment
            }
        });

        return res.send(game)
    }
}