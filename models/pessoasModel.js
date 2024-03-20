const Sequelize = require('sequelize');
const sequelize = require('../middleware/db_config');

const usuariosModel = require('../models/usuariosModel');

const TiposPessoas = sequelize.define('tipos_pessoas', {
    pessoa_tipo_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: false
    },
    pessoa_tipo_nome: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    pessoa_tipo_descricao: {
        type: Sequelize.STRING(1000),
        allowNull: true,
    },
}, {
    createdAt: 'pessoa_tipo_criado_em',
    updatedAt: 'pessoa_tipo_atualizado_em'
});

const Pessoas = sequelize.define('pessoas', {
    pessoa_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    pessoa_nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    pessoa_email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    pessoa_sexo: {
        type: Sequelize.STRING,
        allowNull: true
    },
    pessoa_telefone: {
        type: Sequelize.STRING,
        allowNull: true
    },
    pessoa_endereco: {
        type: Sequelize.STRING,
        allowNull: true
    },
    pessoa_bairro: {
        type: Sequelize.STRING,
        allowNull: true
    },
    pessoa_municipio: {
        type: Sequelize.STRING,
        allowNull: false
    },
    pessoa_estado: {
        type: Sequelize.STRING,
        allowNull: false
    },
    pessoa_cep: {
        type: Sequelize.STRING,
        allowNull: true
    },
    pessoa_informacoes: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    pessoa_tipo_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'tipos_pessoas',
            key: 'pessoa_tipo_id',
            onDelete: 'RESTRICT'
        }
    },
    pessoa_criado_por: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: usuariosModel.Usuario,
            key: 'usuario_id',
            onDelete: 'RESTRICT'
        }
    }
}, {
    createdAt: 'pessoa_criado_em',
    updatedAt: 'pessoa_atualizado_em'
});

Pessoas.belongsTo(TiposPessoas, { foreignKey: 'pessoa_tipo_id', targetKey: 'pessoa_tipo_id' });
Pessoas.belongsTo(usuariosModel.Usuario, { foreignKey: 'pessoa_criado_por', targetKey: 'usuario_id' });

module.exports = { TiposPessoas, Pessoas };