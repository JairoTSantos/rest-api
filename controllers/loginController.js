const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const usuariosModel = require('../models/usuariosModel');

async function login(email, senha) {
    try {
        if (process.env.MASTER_EMAIL === email && process.env.MASTER_PASS === senha) {
            const payload = {
                usuario_nome: process.env.MASTER_USER 
            };

            const token = jwt.sign(payload, process.env.MASTER_KEY, { expiresIn: process.env.TOKEN_TIME });

            return { status: 200, message: 'Login feito com sucesso (usuário mestre)', token: token };
        }

        const usuario = await usuariosModel.Usuario.findOne({ where: { usuario_email: email } });
        
        if (!usuario) {
            return { status: 404, message: 'Email incorreto' };
        }

        const senhaCorrespondente = await bcrypt.compare(senha, usuario.usuario_senha);

        if (!senhaCorrespondente) {
            return { status: 401, message: 'Senha incorreta' };
        }

        const payload = {
            usuario_nome: usuario.usuario_nome 
        };

        const token = jwt.sign(payload, process.env.MASTER_KEY, { expiresIn: '1h' });

        return { status: 200, message: 'Login feito com sucesso', token: token };
    } catch (error) {
        return { status: 500, message: 'Erro interno do servidor', error: error };
    }
}


module.exports = { login };
