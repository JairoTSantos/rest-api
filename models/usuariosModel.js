const Sequelize = require('sequelize');
const sequelize = require('../middleware/db_config');


const NivelUsuario = sequelize.define('niveis_usuarios', {
  usuario_nivel_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: false 
  },
  usuario_nivel: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  usuario_nivel_descricao: {
    type: Sequelize.STRING(1000),
    allowNull: true,
  },
}, {
  createdAt: 'nivel_usuario_criado_em',
  updatedAt: 'nivel_usuario_atualizado_em'
});


const Usuario = sequelize.define('usuarios', {
  usuario_id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  usuario_nome: {
    type: Sequelize.STRING,
    allowNull: false
  },
  usuario_email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  usuario_aniversario: {
    type: Sequelize.DATEONLY
  },
  usuario_telefone: {
    type: Sequelize.STRING
  },
  usuario_senha: {
    type: Sequelize.STRING,
    allowNull: false
  },
  usuario_ativo: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  usuario_token: {
    type: Sequelize.STRING,
    defaultValue: null
  },
  usuario_nivel: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'niveis_usuarios',
      key: 'usuario_nivel_id',
      onDelete: 'RESTRICT'
    }
  }
}, {
  createdAt: 'usuario_criado_em',
  updatedAt: 'usuario_atualizado_em'
});


module.exports = { Usuario, NivelUsuario };