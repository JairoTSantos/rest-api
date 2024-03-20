const Sequelize = require('sequelize');
const sequelize = require('../middleware/db_config');

const usuariosModel = require('../models/usuariosModel');

const TiposOrgaos = sequelize.define('tipos_orgaos', {
  orgao_tipo_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: false
  },
  orgao_tipo_nome: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  orgao_descricao: {
    type: Sequelize.STRING(1000),
    allowNull: true,
  },
}, {
  createdAt: 'orgao_tipo_criado_em',
  updatedAt: 'orgao_tipo_atualizado_em'
});

const Orgaos = sequelize.define('orgaos', {
  orgao_id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  orgao_nome: {
    type: Sequelize.STRING,
    allowNull: false
  },
  orgao_email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  orgao_telefone: {
    type: Sequelize.STRING,
    allowNull: true
  },
  orgao_endereco: {
    type: Sequelize.STRING,
    allowNull: true
  },
  orgao_bairro: {
    type: Sequelize.STRING,
    allowNull: true
  },
  orgao_muncipio: {
    type: Sequelize.STRING,
    allowNull: false
  },
  orgao_estado: {
    type: Sequelize.STRING,
    allowNull: false
  },
  orgao_cep: {
    type: Sequelize.STRING,
    allowNull: true
  },
  orgao_informacoes: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  orgao_tipo: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'tipos_orgaos',
      key: 'orgao_tipo_id'
    },
    onDelete: 'RESTRICT',
    onUpdate: 'NO ACTION'
  },
  orgao_criado_por: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: usuariosModel.Usuario,
      key: 'usuario_id'
    },
    onDelete: 'RESTRICT',
    onUpdate: 'NO ACTION'
  }
}, {
  createdAt: 'orgao_criado_em',
  updatedAt: 'orgao_atualizado_em'
});

Orgaos.belongsTo(TiposOrgaos, { foreignKey: 'orgao_tipo', targetKey: 'orgao_tipo_id' });
Orgaos.belongsTo(usuariosModel.Usuario, {foreignKey: 'orgao_criado_por', targetKey: 'usuario_id'});

module.exports = { TiposOrgaos, Orgaos };