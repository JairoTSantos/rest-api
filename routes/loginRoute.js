const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

router.post('/api/login', async (req, res) => {
    const email = req.body.email;
    const senha = req.body.senha;

    if (!email || !senha) {
        return res.status(400).json({ status: 400, message: 'Confira os campos obrigatórios' });
    }

    const resp = await loginController.login(email, senha);
    res.status(resp.status).json(resp);
});


module.exports = router;
