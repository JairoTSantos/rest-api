const fs = require('fs');
const path = require('path');


const orgaosModel = require('../models/orgaosModel');
const usuariosModel = require('../models/usuariosModel');

async function getOrganizations(itens, page, orderBy, orderDirection) {
    try {
        let order = [];
        if (orderBy && orderDirection) {
            order.push([orderBy, orderDirection.toUpperCase()]);
        }

        const orgaos = await orgaosModel.Orgaos.findAndCountAll({
            limit: itens,
            offset: itens * (page - 1),
            order,
            include: [
                {
                    model: orgaosModel.TiposOrgaos,
                    required: true,
                    attributes: ['orgao_tipo_nome', 'orgao_descricao']
                },
                {
                    model: usuariosModel.Usuario,
                    required: true,
                    attributes: ['usuario_id', 'usuario_nome']
                }
            ]
        });
        
        const totalPages = Math.ceil(orgaos.count / itens);

        const links = {
            first: `/api/orgaos?itens=${itens}&pagina=1&ordenarPor=${orderBy}&ordem=${orderDirection}`,
            self: `/api/orgaos?itens=${itens}&pagina=${page}&ordenarPor=${orderBy}&ordem=${orderDirection}`,
            last: `/api/orgaos?itens=${itens}&pagina=${totalPages}&ordenarPor=${orderBy}&ordem=${orderDirection}`
        };

        return { status: 200, message: `${orgaos.rows.length} órgãos encontrados`, data: orgaos.rows, links };
    } catch (error) {
        return { status: 500, message: 'Erro interno do servidor', error: error };
    }
}

async function getOrganizationById(id) {
    try {
        const orgao = await orgaosModel.Orgaos.findByPk(id ,{
            include: [
                {
                    model: orgaosModel.TiposOrgaos,
                    required: true,
                    attributes: ['orgao_tipo_nome', 'orgao_descricao']
                },
                {
                    model: usuariosModel.Usuario,
                    required: true,
                    attributes: ['usuario_id', 'usuario_nome']
                }
            ]
        });

        if (!orgao) {
            return { status: 404, message: 'Órgão não encontrado' };
        }

        return { status: 200, message: 'Órgão encontrado', data: orgao };
    } catch (error) {
        return { status: 500, message: 'Erro interno do servidor', error: error };
    }
}

async function deleteOrganization(id) {
    try {
        const orgao = await orgaosModel.Orgaos.findByPk(id);

        if (!orgao) {
            return { status: 404, message: 'Órgão não encontrado' };
        }

        await orgao.destroy();

        return { status: 200, message: 'Órgão excluído com sucesso' };
    } catch (error) {
        if (error.original.errno === 1451) {
            return { status: 401, message: 'Não é possível excluir esse órgão devido às referências importantes a ele associadas', error: error.name };
        }
        return { status: 500, message: 'Erro interno do servidor', error: error.name };
    }
}

async function addOrganization(data){

    try {
        await orgaosModel.Orgaos.create(data);
        return { status: 200, message: 'Órgão adicionado com sucesso', data: { orgao_id: data.orgao_id } };
    } catch (error) {
        if (error.original.errno === 1062) {
            return { status: 409, message: 'Órgão já inserido' };
        }
        return { status: 500, message: 'Erro interno do servidor', error: error };
    }

}

async function updateOrganization(id, newData) {
    try {
        const orgao = await orgaosModel.Orgaos.findByPk(id);

        if (!orgao) {
            return { status: 404, message: 'Órgão não encontrado' };
        }

        if (Object.keys(newData).length === 0) {
            return { status: 400, message: 'Nada para atualizar' };
        }

        await orgao.update(newData);

        return { status: 200, message: 'Órgão atualizado com sucesso' };
    } catch (error) {
        return { status: 500, message: 'Erro interno do servidor', error: error };
    }
}

async function getTypesOrganizations() {
    try {
        const tipos = await orgaosModel.TiposOrgaos.findAndCountAll();
        return { status: 200, message: `${orgaos.rows.length} órgãos encontrados`, data: orgaos.rows, links };
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
        return { status: 500, message: 'Erro interno do servidor', error: error };
    }
}

module.exports = {  syncOrganizations, getTypesOrganizations, addOrganization, getOrganizations, getOrganizationById, deleteOrganization, updateOrganization };