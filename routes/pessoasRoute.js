const express = require('express');
const router = express.Router();
const pessoasController = require('../controllers/pessoasController');

router.get('/api/pessoas', async (req, res) => {
    let itens = parseInt(req.query.itens) || 10;
    let page = parseInt(req.query.pagina) || 1;
    let orderBy = req.query.ordenarPor || 'pessoa_nome';
    let orderDirection = req.query.ordem || 'ASC';

    const resp = await pessoasController.getPeoples(itens, page, orderBy, orderDirection);
    res.status(resp.status).json(resp);
});

router.get('/api/pessoas/:id', async (req, res) => {
    let id = req.params.id;

    const resp = await pessoasController.getPeopleById(id);
    res.status(resp.status).json(resp);
});

router.delete('/api/pessoas/:id', async (req, res) => {
    let id = req.params.id;

    const resp = await pessoasController.deletePeople(id);
    res.status(resp.status).json(resp);
});

router.post('/api/pessoas', async (req, res) => {
    const pessoaPost = { pessoa_nome, pessoa_email, pessoa_telefone, pessoa_endereco, pessoa_bairro, pessoa_estado, pessoa_cep, pessoa_criado_por, pessoa_sexo, pessoa_municipio, pessoa_informacoes, pessoa_orgao_id, pessoa_tipo_id} = req.body;

    if (!pessoa_nome || !pessoa_email || !pessoa_estado || !pessoa_criado_por || !pessoa_municipio || !pessoa_tipo_id || !pessoa_orgao_id) {
        return res.status(400).json({ status: 400, message: 'Confira os campos obrigatórios' });
    }
    const resp = await pessoasController.addPeople(pessoaPost);
    res.status(resp.status).json(resp);

});

router.put('/api/pessoas/:id', async (req, res) => {
    let id = req.params.id;
    const pessoaPost = { pessoa_nome, pessoa_email, pessoa_telefone, pessoa_endereco, pessoa_bairro, pessoa_estado, pessoa_cep, pessoa_criado_por, pessoa_sexo, pessoa_municipio, pessoa_informacoes, pessoa_orgao_id, pessoa_tipo_id} = req.body;
    const resp = await pessoasController.updatePeople(id, pessoaPost);
    res.status(resp.status).json(resp);
});

router.get('/api/pessoas-sync', async (req, res) => {
    const resp = await pessoasController.syncPeoples();
    res.status(resp.status).json(resp);
});

module.exports = router;