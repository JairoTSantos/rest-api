const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

router.get('/api/usuarios', async (req, res) => {
    let itens = parseInt(req.query.itens) || 10;
    let page = parseInt(req.query.pagina) || 1;

    const resp = await usuariosController.getUsers(itens, page);
    res.status(resp.status).json(resp);
});

router.get('/api/usuarios/:id', async (req, res) => {
    let id = req.params.id;

    const resp = await usuariosController.getUserById(id);
    res.status(resp.status).json(resp);
});

router.delete('/api/usuarios/:id', async (req, res) => {
    let id = req.params.id;

    const resp = await usuariosController.deleteUser(id);
    res.status(resp.status).json(resp);
});

router.post('/api/usuarios', async (req, res) => {
    const usuarioPost = { usuario_nome, usuario_email, usuario_senha, usuario_telefone, usuario_aniversario, usuario_nivel, usuario_ativo } = req.body;

    if (!usuario_nome || !usuario_email || !usuario_senha || !usuario_telefone || !usuario_aniversario || !usuario_nivel || !usuario_ativo) {
        return res.status(400).json({ status: 400, message: 'Confira os campos obrigatórios' });
    }
    const resp = await usuariosController.addUser(usuarioPost);
    res.status(resp.status).json(resp);

});

router.put('/api/usuarios/:id', async (req, res) => {
    let id = req.params.id;
    const usuarioPost = { usuario_nome, usuario_email, usuario_senha, usuario_telefone, usuario_aniversario, usuario_nivel, usuario_ativo } = req.body;
    const resp = await usuariosController.updateUser(id, usuarioPost);
    res.status(resp.status).json(resp);
});

router.get('/api/usuarios-niveis/', async (req, res) => {
    const resp = await usuariosController.getLevelUsers();
    res.status(resp.status).json(resp);
});

router.get('/api/usuarios-sync', async (req, res) => {
    const resp = await usuariosController.syncUsers();
    res.status(resp.status).json(resp);
});

module.exports = router;
