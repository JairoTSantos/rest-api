const express = require('express');
const router = express.Router();
const orgaosController = require('../controllers/orgaosController');

router.get('/api/orgaos', async (req, res) => {
    let itens = parseInt(req.query.itens) || 10;
    let page = parseInt(req.query.pagina) || 1;
    let orderBy = req.query.ordenarPor || 'orgao_nome';
    let orderDirection = req.query.ordem || 'ASC';

    const resp = await orgaosController.getOrganizations(itens, page, orderBy, orderDirection);
    res.status(resp.status).json(resp);
});

router.get('/api/orgaos/:id', async (req, res) => {
    let id = req.params.id;

    const resp = await orgaosController.getOrganizationById(id);
    res.status(resp.status).json(resp);
});

router.delete('/api/orgaos/:id', async (req, res) => {
    let id = parseInt(req.params.id);

    const resp = await orgaosController.deleteOrganization(id);
    res.status(resp.status).json(resp);
});

router.post('/api/orgaos', async (req, res) => {
    const orgaoPost = { orgao_nome, orgao_email, orgao_muncipio, orgao_estado, orgao_tipo, orgao_criado_por} = req.body;

    if (!orgao_nome || !orgao_email || !orgao_muncipio || !orgao_estado || !orgao_tipo || !orgao_criado_por) {
        return res.status(400).json({ status: 400, message: 'Confira os campos obrigatórios' });
    }
    const resp = await orgaosController.addOrganization(orgaoPost);
    res.status(resp.status).json(resp);

});

router.put('/api/orgaos/:id', async (req, res) => {
    let id = req.params.id;
    const orgaoPost = { orgao_nome, orgao_email, orgao_telefone, orgao_endereco, orgao_bairro, orgao_muncipio, orgao_estado, orgao_cep, orgao_informacoes, orgao_tipo, orgao_criado_por} = req.body;
    const resp = await orgaosController.updateOrganization(id, orgaoPost);
    res.status(resp.status).json(resp);
});

router.get('/api/orgaos-tipos', async (req, res) => {
    const resp = await orgaosController.getTypesOrganizations();
    res.status(resp.status).json(resp);
});

router.get('/api/orgaos-sync', async (req, res) => {
    const resp = await orgaosController.syncOrganizations();
    res.status(resp.status).json(resp);
});

module.exports = router;
