const express = require('express');
const router = express.Router();
const orgaosController = require('../controllers/orgaosController');



router.get('/api/orgaos-tipos', async (req, res) => {
    const resp = await orgaosController.getTypesOrganizations();
    res.status(resp.status).json(resp);
});

router.get('/api/orgaos-sync', async (req, res) => {
    const resp = await orgaosController.syncOrganizations();
    res.status(resp.status).json(resp);
});

module.exports = router;
