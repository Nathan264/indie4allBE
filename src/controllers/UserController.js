const User = require('../models/User');
const mailer = require('../services/mailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = {
    async register(req, res) {
        req.body.confirmPassword = '';
        const checkUsername = await User.findOne({
            $or: [ 
                {username: req.body.username},
                {email: req.body.email}
            ]
        });

        if(checkUsername) {
            return res.send({message: 'O usuário ou email informado ja está em uso'});
        }

        const newUser = await User.create(req.body);
        const mailUrl = await mailer.sendConfirmation(newUser.email, newUser.username, newUser.token);

        newUser.password = '';
        return res.send({
            message:'Um email de confirmação foi enviado para a sua caixa de mensagens',
            mailUrl
        });
    },

    async login(req, res) {
        const { username, password } = req.body;
        const user = await User.findOne({username}, 'username accStatus userImage moderator +password');
        if(!user || !await bcrypt.compare(password, user.password)) {
            return res.send({message: "Usuário ou senha inválidos"});
        }
        if(user.accStatus === false) {
            return res.send({message: "Essa conta precisa ser confirmada antes de poder ser usada"});
        }
        const token = jwt.sign({username: user.username, moderator: user.moderator}, process.env.SECRET, { 
            expiresIn: 86400 
        });
        user.password = '';
        user._id = '';
        return res.send({token, user});
    },

    async getUserInfo(req, res) {
        const {username} = req.query;
        const user = await User.findOne({username}, 'email username birthDate moderator');
        return res.send(user);
    }
    
}