const express = require('express');
const router = express.Router();
const proposicoesController = require('../controllers/proposicoesController');

router.get('/api/atualizar-autores/:ano', async (req, res) => {
    let ano = parseInt(req.params.ano) || 2024;
    const resp = await proposicoesController.updateAutores(ano);
    res.status(resp.status).json(resp);
});

router.get('/api/atualizar-proposicoes/:ano', async (req, res) => {
    let ano = parseInt(req.params.ano) || 2024;
    const resp = await proposicoesController.updateProposicoes(ano);
    res.status(resp.status).json(resp);
});

router.get('/api/proposicoes', async (req, res) => {
    let { itens, pagina, ordenarPor, ordem, ano, tipo, arquivo } = req.query;

    itens = parseInt(itens) || 10;
    pagina = parseInt(pagina) || 1;
    ordenarPor = ['proposicao_apresentacao', 'proposicao_titulo'].includes(ordenarPor) ? ordenarPor : 'proposicao_apresentacao';
    ordem = ['ASC', 'DESC'].includes(ordem) ? ordem : 'DESC';
    ano = parseInt(ano) || 2024;
    tipo = tipo || 'PL';
    arquivo = (arquivo === 'true');

    const resp = await proposicoesController.getProposicoes(itens, pagina, ordenarPor, ordem, ano, tipo, arquivo);
    res.status(resp.status).json(resp);
});




router.get('/api/proposicoes-sync', async (req, res) => {
    const resp = await proposicoesController.sync();
    res.status(resp.status).json(resp);
});


module.exports = router;
