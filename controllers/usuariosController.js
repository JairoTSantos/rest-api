const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');


const usuariosModel = require('../models/usuariosModel');

async function getUsers(itens, page) {
    try {

        const usuarios = await usuariosModel.Usuario.findAndCountAll({
            limit: itens,
            offset: itens * (page - 1),
            attributes: {
                exclude: 'usuario_senha'
            }
        });

        const totalPages = Math.ceil(usuarios.count / itens);

        const links = {
            first: `/api/usuarios?itens=${itens}&pagina=1`,
            self: `/api/usuarios?itens=${itens}&pagina=${page}`,
            last: `/api/usuarios?itens=${itens}&pagina=${totalPages}`
        };

        return { status: 200, message: `${usuarios.rows.length} usuários encontrados`, data: usuarios.rows, links };
    } catch (error) {
        if (error.original.errno === 1451) {
            return { status: 401, message: 'Não é possível excluir esse usuário devido às referências importantes a ele associadas', error: error.name };
        }
        return { status: 500, message: 'Erro interno do servidor', error: error.name };
    }
}

async function getUserById(id) {
    try {
        const usuario = await usuariosModel.Usuario.findByPk(id, {
            attributes: {
                exclude: ['usuario_senha']
            }
        });

        if (!usuario) {
            return { status: 404, message: 'Usuário não encontrado' };
        }

        return { status: 200, message: 'Usuário encontrado', data: usuario };
    } catch (error) {
        return { status: 500, message: 'Erro interno do servidor', error: error };
    }
}

async function deleteUser(id) {
    try {
        const usuario = await usuariosModel.Usuario.findByPk(id);

        if (!usuario) {
            return { status: 404, message: 'Usuário não encontrado' };
        }

        await usuario.destroy();

        return { status: 200, message: 'Usuário excluído com sucesso' };
    } catch (error) {
        return { status: 500, message: 'Erro interno do servidor', error: error.name };
    }
}

async function addUser(data) {
    try {
        const hashedPassword = await bcrypt.hash(data.usuario_senha, 10);
        data.usuario_senha = hashedPassword;
        await usuariosModel.Usuario.create(data);
        return { status: 200, message: 'Usuário adicionado com sucesso', data: { usuario_id: data.usuario_id } };
    } catch (error) {
        if (error.original.errno === 1062) {
            return { status: 409, message: 'Usuário já inserido' };
        } else if (error.name === 'bcryptjsError') {
            return { status: 500, message: 'Erro ao gerar o hash da senha', error: error };
        } else {
            return { status: 500, message: 'Erro interno do servidor', error: error.name };
        }
    }
}

async function updateUser(id, newData) {
    try {
        const usuario = await usuariosModel.Usuario.findByPk(id);

        if (!usuario) {
            return { status: 404, message: 'Usuário não encontrado' };
        }

        if (Object.keys(newData).length === 0) {
            return { status: 400, message: 'Nada para atualizar' };
        }

        await usuario.update(newData);

        return { status: 200, message: 'Usuário atualizado com sucesso' };
    } catch (error) {
        return { status: 500, message: 'Erro interno do servidor', error: error.name };
    }
}

async function getLevelUsers() {
    try {
        const niveis = await usuariosModel.NivelUsuario.findAndCountAll();
        return { status: 200, message: niveis.rows.length + ' níveis encontrados', data: niveis.rows };
    } catch (error) {
        return { status: 200, message: `${niveis.rows.length} níveis encontrados`, data: niveis.rows };
    }
}

async function syncUsers() {
    try {
        await usuariosModel.NivelUsuario.sync({ alter: true });

        const niveisJsonPath = path.join(__dirname, '../json/niveis_usuarios.json');
        const niveisJson = fs.readFileSync(niveisJsonPath, 'utf8');

        const niveis = JSON.parse(niveisJson);
        await usuariosModel.NivelUsuario.bulkCreate(niveis, {
            updateOnDuplicate: ['usuario_nivel', 'usuario_nivel_descricao']
        });
        await usuariosModel.Usuario.sync({ alter: true });
        return { status: 200, message: 'Tabelas atualizadas' };
    } catch (error) {
        return { status: 500, message: 'Erro interno do servidor', error: error.name };
    }
}

module.exports = { getUsers, getUserById, deleteUser, addUser, updateUser, syncUsers, getLevelUsers };