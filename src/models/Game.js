const { model, Schema } = require('mongoose');

const GameSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    dev: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sinopse: {
        type: String,
        required: true
    },
    categories: {
        type: [String],
        required: true
    },
    launchDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    images: {
        type: [String],
    },
    rating: {
        type: Number,
        required: true,
        default: 0
    }, 
    numberRt: {
        type: Number,
        default: 0, 
    },
    archive: {
        type: String,
        required: true,
    },
    downloads: {
        type: Number,
        required: true,
        default: 0
    },
    reqMin: {
        cpu: { type: String, required: true },
        gpu: { type: String, required: true },
        ram: { type: String, required: true },
        storage: { type: String, required: true },
        so: { type: String, required: true },
    },
    reqRec: {
        cpu: { type: String, required: true },
        gpu: { type: String, required: true },
        ram: { type: String, required: true },
        storage: { type: String, required: true },
        so: { type: String, required: true },
    },
    comments: [
        {
            text: String,
            rating: Number,
            user: { 
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    ],
    analysed: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
const Game = model('Game', GameSchema);

module.exports = Game;