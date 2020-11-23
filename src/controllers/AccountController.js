const User = require('../models/User');
const PwdRecover = require('../models/PwdRecover');
const mailer = require('../services/mailer');
const fs = require('fs');
const bcrypt = require('bcrypt');

module.exports = {
    async verifyAccount(req, res) {
        const { email, username, token } = req.query;
        const user = await User.findOneAndUpdate({
            username,
            email,
            token
        }, {
            accStatus: true,
            $unset: { token }
        });
        return res.redirect('http://localhost:3000')
    },

    async altUserImg(req, res) {
        const { filename } = req.file;
        const { username } = req.body;  
        const altUser = await User.findOneAndUpdate({
            username
        }, {
            
            userImage: filename
        });
        fs.rename(`${__dirname}/../../uploads/tmp/${filename}`, `${__dirname}/../../uploads/images/${filename}`, ()=>{});
        
        return res.send(altUser)
    },

    async altInfoUser(req, res) {
        const {username} = req.body;
        if(req.body.newPassword){
            hash = await bcrypt.hash(req.body.newPassword, 10);
            await User.updateOne({username}, {password: hash});
        }else if(req.body.newUsername) {
            await User.updateOne({username}, {username: req.body.newUsername})
        }else {
            res.send({message: 'Houve um erro durante a atualização'});
        }
        return res.send({message: 'Alteração concluida'});
    },

    async requestPwdChange(req, res) {
        const { email, username } = req.body;
        const user = await User.findOne({
            email,
            username,
        });
        
        if(!user) {
            return res.send({message: 'As credenciais informadas não foram localizadas'});
        }

        const token = await bcrypt.hash(email, 10);
        const request = await PwdRecover.create({
            token,
            user: user._id
        });

        const mailUrl = await mailer.recoverPwdMail(email, username, request.token);

        return res.send({
            message: 'Pedido feito com sucesso', 
            mailUrl
        });
    },

    async changePwd(req, res) {
        const { token, email, username, pwd } = req.body;

        if(!token || !email || !username) {
            return res.send({message: 'Credenciais não informadas corretamente'});
        }

        const request = await PwdRecover.findOne({
            token
        }).populate('user', 'email username');

        if(email !== request.user.email || username !== request.user.username){
            return res.send({message: 'Credenciais não informadas corretamente'});
        }

        const hash = await bcrypt.hash(pwd, 10);
        const user = await User.updateOne({
            username,
        }, {
            password: hash
        });        

        if(user.nModified === 0) {
            return res.send({message: 'Não foi possivel alterar a senha'});
        }

        await PwdRecover.deleteOne({token});

        return res.send({message: 'Senha alterada com sucesso'});
    }
}