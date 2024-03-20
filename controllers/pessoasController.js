const fs = require('fs');
const path = require('path');


const pessoasModel = require('../models/pessoasModel');
const usuariosModel = require('../models/usuariosModel');



async function syncPeoples() {
    try {
        await pessoasModel.TiposPessoas.sync({ alter: true });

        const tiposJsonPath = path.join(__dirname, '../json/tipos_pessoas.json');
        const tiposJson = fs.readFileSync(tiposJsonPath, 'utf8');

        const tiposPessoas = JSON.parse(tiposJson);
        await pessoasModel.TiposPessoas.bulkCreate(tiposPessoas, {
            updateOnDuplicate: ['pessoa_tipo_nome', 'pessoa_tipo_descricao']
        });
        await pessoasModel.Pessoas.sync({ alter: true });
        return { status: 200, message: 'Tabelas atualizadas' };
    } catch (error) {
        return { status: 500, message: 'Erro interno do servidor', error: error.name };
    }
}


module.exports = { syncPeoples};