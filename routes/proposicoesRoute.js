const express = require('express');
const router = express.Router();
require('dotenv').config();

const proposicoesController = require('../controllers/proposicoesController');

router.get('/api/adicionar-autores/:ano', async (req, res) => {
    let ano = parseInt(req.params.ano) || 2024;
    const resp = await proposicoesController.updateAutores(ano);
    res.status(resp.status).json(resp);
});

router.get('/api/adicionar-proposicoes/:ano', async (req, res) => {
    let ano = parseInt(req.params.ano) || 2024;
    const resp = await proposicoesController.updateProposicoes(ano);
    res.status(resp.status).json(resp);
});

router.get('/api/proposicoes', async (req, res) => {
    let { itens, pagina, ordenarPor, ordem, ano, tipo, arquivo } = req.query;

    itens = parseInt(itens) || 10;
    pagina = parseInt(pagina) || 1;
    ordenarPor = ['proposicao_id', 'proposicao_titulo'].includes(ordenarPor) ? ordenarPor : 'proposicao_apresentacao';
    ordem = ['ASC', 'DESC'].includes(ordem) ? ordem : 'DESC';
    ano = parseInt(ano) || 2024;
    tipo = tipo || 'PL';
    arquivo = (arquivo === 'true');

    const resp = await proposicoesController.getProposicoes(itens, pagina, ordenarPor, ordem, ano, tipo, arquivo);
    res.status(resp.status).json(resp);
});

router.get('/api/autorias', async (req, res) => {
    let { itens, pagina, ordenarPor, ordem, ano, tipo, arquivo, autor } = req.query;

    itens = parseInt(itens) || 10;
    pagina = parseInt(pagina) || 1;
    ordenarPor = ordenarPor || 'proposicao_id';
    ordem = ['ASC', 'DESC'].includes(ordem) ? ordem : 'DESC';
    autor = autor || process.env.ID_DEPUTADO;
    ano = ano || 2023;
    tipo = tipo || 'PL';
    arquivo = (arquivo === 'true');

    const resp = await proposicoesController.getAutorias(itens, pagina, ordenarPor, ordem, autor, ano, tipo, arquivo);
    res.status(resp.status).json(resp);
});


router.get('/api/proposicoes-sync', async (req, res) => {
    const resp = await proposicoesController.sync();
    res.status(resp.status).json(resp);
});


module.exports = router;
