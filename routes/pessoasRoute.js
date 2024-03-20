const express = require('express');
const router = express.Router();
const pessoasController = require('../controllers/pessoasController');


router.get('/api/pessoas-sync', async (req, res) => {
    const resp = await pessoasController.syncPeoples();
    res.status(resp.status).json(resp);
});

module.exports = router;