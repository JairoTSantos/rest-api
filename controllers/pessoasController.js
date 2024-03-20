const fs = require('fs');
const path = require('path');


const pessoasModel = require('../models/pessoasModel');
const usuariosModel = require('../models/usuariosModel');

async function getPeoples(itens, page, orderBy, orderDirection) {
    try {
        let order = [];
        if (orderBy && orderDirection) {
            order.push([orderBy, orderDirection.toUpperCase()]);
        }

        const orgaos = await pessoasModel.Pessoas.findAndCountAll({
            limit: itens,
            offset: itens * (page - 1),
            order,
            include: [
                {
                    model: pessoasModel.TiposPessoas,
                    required: true,
                    attributes: ['pessoa_tipo_nome', 'pessoa_tipo_descricao']
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
            first: `/api/pessoas?itens=${itens}&pagina=1&ordenarPor=${orderBy}&ordem=${orderDirection}`,
            self: `/api/pessoas?itens=${itens}&pagina=${page}&ordenarPor=${orderBy}&ordem=${orderDirection}`,
            last: `/api/pessoas?itens=${itens}&pagina=${totalPages}&ordenarPor=${orderBy}&ordem=${orderDirection}`
        };

        return { status: 200, message: orgaos.rows.length + ' pessoas encontradas', data: orgaos.rows, links };
    } catch (error) {
        return { status: 500, message: 'Erro interno do servidor', error: error };
    }
}

async function getPeopleById(id) {
    try {
        const orgao = await pessoasModel.Pessoas.findByPk(id ,{
            include: [
                {
                    model: pessoasModel.TiposPessoas,
                    required: true,
                    attributes: ['pessoa_tipo_nome', 'pessoa_tipo_descricao']
                },
                {
                    model: usuariosModel.Usuario,
                    required: true,
                    attributes: ['usuario_id', 'usuario_nome']
                }
            ]
        });

        if (!orgao) {
            return { status: 404, message: 'Pessoa não encontrada' };
        }

        return { status: 200, message: 'Pessoa encontrada', data: orgao };
    } catch (error) {
        return { status: 500, message: 'Erro interno do servidor', error: error };
    }
}

async function addPeople(data){

    try {
        await pessoasModel.Pessoas.create(data);
        return { status: 200, message: 'Pessoa adicionada com sucesso', data: { pessoa_id: data.pessoa_id } };
    } catch (error) {
        if (error.original.errno === 1062) {
            return { status: 409, message: 'Pessoa já inserida' };
        }
        return { status: 500, message: 'Erro interno do servidor', error: error };
    }

}

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


module.exports = { syncPeoples, getPeoples, addPeople, getPeopleById };