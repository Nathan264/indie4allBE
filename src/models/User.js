const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    birthDate: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    accStatus: {
        type: Boolean,
        required: true,
        default: false
    },
    token: {
        type: String,
        required: false,
    },
    moderator: {
        type: Boolean,
        default: false
    },
    userImage: {
        type: String,
        default: '/images/default.png'
    }
});

UserSchema.pre('save', async function(req, res, next) {
    this.password = await bcrypt.hash(this.password, 10);
    this.token = await bcrypt.hash(this.email, 10);
    next();
});

const User = model('User', UserSchema);

module.exports = User;