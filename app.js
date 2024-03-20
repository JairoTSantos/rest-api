const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());
app.use(express.static('public'));

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ status: 400, message: 'Formato de JSON não aceito' });
    }
    next();
});



app.get('/api', (req, res) => {
    res.status(200).json({status: 200, message: 'Api em funcionamento, Consulte a documentação em /api-docs'});
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public'));
});

const loginRoute = require('./routes/loginRoute');
app.use('/', loginRoute);

const verificarToken = require('./middleware/authMiddleware');

const usuariosRoute = require('./routes/usuariosRoute');
app.use('/', verificarToken, usuariosRoute);

const orgaosRoute = require('./routes/orgaosRoute');
app.use('/', verificarToken,  orgaosRoute);

app.use((req, res, next) => {
    res.status(404).json({ status: 404, message: 'ENDPOINT não encontrado' });
});

app.listen(process.env.PORT);
