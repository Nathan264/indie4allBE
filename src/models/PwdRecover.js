const { Schema, model } = require('mongoose');

const PwdRecoverSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const PwdRecover = model('PwdRecover', PwdRecoverSchema);

module.exports = PwdRecover;