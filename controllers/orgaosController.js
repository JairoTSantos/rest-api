const fs = require('fs');
const path = require('path');


const orgaosModel = require('../models/orgaosModel');


async function getTypesOrganizations() {
    try {
        const tipos = await orgaosModel.TiposOrgaos.findAndCountAll();
        return { status: 200, message: tipos.rows.length + ' tipos encontrados', data: tipos.rows };
    } catch (error) {
        return { status: 500, message: 'Erro interno do servidor', error: error.name };
    }
}

async function syncOrganizations() {
    try {
        await orgaosModel.TiposOrgaos.sync({ alter: true });

        const tiposJsonPath = path.join(__dirname, '../json/tipos_orgaos.json');
        const tiposJson = fs.readFileSync(tiposJsonPath, 'utf8');

        const tiposOrgaos = JSON.parse(tiposJson);
        await orgaosModel.TiposOrgaos.bulkCreate(tiposOrgaos, {
            updateOnDuplicate: ['orgao_tipo', 'orgao_descricao']
        });
        await orgaosModel.Orgaos.sync({ alter: true });
        return { status: 200, message: 'Tabelas atualizadas' };
    } catch (error) {
        return { status: 500, message: 'Erro interno do servidor', error: error.name };
    }
}

module.exports = {  syncOrganizations, getTypesOrganizations };