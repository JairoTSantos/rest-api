const Sequelize = require('sequelize');
const sequelize = require('../middleware/db_config');


const AutoresProposicoes = sequelize.define('proposicoes_autores', {
    proposicao_id: {
        type: Sequelize.INTEGER,
        primaryKey: false,
        allowNull: false
    },
    proposicao_ano: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    autor_id: {
        type: Sequelize.INTEGER,
        primaryKey: false,
        allowNull: true
    },
    autor_nome: {
        type: Sequelize.STRING(1000),
        allowNull: true,
    },
    autor_partido: {
        type: Sequelize.STRING(20),
        allowNull: true,
    },
    autor_estado: {
        type: Sequelize.STRING(10),
        allowNull: true,
    },
    autor_assinatura: {
        type: Sequelize.INTEGER,
        primaryKey: false,
        allowNull: true
    },
    autor_proponente: {
        type: Sequelize.INTEGER,
        primaryKey: false,
        allowNull: true
    },
}, {
    timestamps: false,
    indexes: [
        {
            unique: false,
            fields: ['proposicao_id']
        }
    ]
});


const Proposicoes = sequelize.define('proposicoes', {
    proposicao_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    proposicao_ano: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    proposicao_numero: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    proposicao_sigla: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    proposicao_titulo: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    proposicao_ementa: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    proposicao_apresentacao: {
        type: Sequelize.DATEONLY,
        allowNull: false,
    },
    proposicao_arquivo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    }
    
},{
    timestamps: false,
});

Proposicoes.hasMany(AutoresProposicoes, { foreignKey: 'proposicao_id', sourceKey: 'proposicao_id' });
AutoresProposicoes.hasMany(Proposicoes, { foreignKey: 'proposicao_id', sourceKey: 'proposicao_id' });

module.exports = { AutoresProposicoes, Proposicoes };