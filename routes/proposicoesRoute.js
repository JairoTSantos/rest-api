const express = require('express');
const router = express.Router();
const proposicoesController = require('../controllers/proposicoesController');

router.get('/api/proposicoes/autores/:ano', async (req, res) => {
    let ano = parseInt(req.params.ano) || 2024;
    const resp = await proposicoesController.getAutores(ano);
    res.status(resp.status).json(resp);
});

router.get('/api/proposicoes/:ano', async (req, res) => {
    let ano = parseInt(req.params.ano) || 2024;
    const resp = await proposicoesController.getProposicoes(ano);
    res.status(resp.status).json(resp);
});



router.get('/api/proposicoes-sync', async (req, res) => {
    const resp = await proposicoesController.sync();
    res.status(resp.status).json(resp);
});


module.exports = router;
