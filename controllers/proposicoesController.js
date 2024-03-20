const axios = require('axios');
const https = require('https');//remover assim q a cd arrumar o dados abertos

const proposicoesModel = require('../models/proposicoesModel');
const { where } = require('sequelize');


async function getProposicoes(itens, page, orderBy, orderDirection, ano, tipo, arquivo) {
    try {
        let order = [];
        if (orderBy && orderDirection) {
            order.push([orderBy, orderDirection.toUpperCase()]);
        }

        const proposicoes = await proposicoesModel.Proposicoes.findAndCountAll({
            where: {
                proposicao_ano: ano,
                proposicao_sigla: tipo,
                proposicao_arquivo: arquivo
            },
            limit: parseInt(itens),
            offset: parseInt(itens) * (page - 1),
            order,
            include: [
                {
                    model: proposicoesModel.AutoresProposicoes,
                    required: true,
                    attributes: ['autor_nome', 'autor_partido', 'autor_estado', 'autor_id', 'autor_proponente', 'autor_assinatura']
                }
            ]
        });

        const totalPages = Math.ceil(proposicoes.count / itens);

        const links = {
            first: `/api/proposicoes?itens=${itens}&pagina=1&ordenarPor=${orderBy}&ordem=${orderDirection}&ano=${ano}&tipo=${tipo}&arquivo=${arquivo}`,
            self: `/api/proposicoes?itens=${itens}&pagina=${page}&ordenarPor=${orderBy}&ordem=${orderDirection}&ano=${ano}&tipo=${tipo}&arquivo=${arquivo}`,
            last: `/api/proposicoes?itens=${itens}&pagina=${totalPages}&ordenarPor=${orderBy}&ordem=${orderDirection}&ano=${ano}&tipo=${tipo}&arquivo=${arquivo}`
        };

        return { status: 200, message: proposicoes.count + ' proposições encontradas', data: proposicoes.rows, links };
    } catch (error) {
        return { status: 500, message: 'Erro interno do servidor', error: error };
    }
}

async function getAutorias(itens, pagina, orderBy, orderDirection, autor, ano, tipo, arquivo) {
    try {
        let order = [];
        if (orderBy && orderDirection) {
            order.push([orderBy, orderDirection.toUpperCase()]);
        }

        const autorias = await proposicoesModel.AutoresProposicoes.findAndCountAll({
            where: {
                autor_id: autor,
                proposicao_ano: ano,
                autor_proponente: 1,
                autor_assinatura: 1
            },
            limit: parseInt(itens),
            offset: parseInt(itens) * (pagina - 1),
            order,
            include: [{
                model: proposicoesModel.Proposicoes,
                where: {
                    proposicao_sigla: tipo,
                    proposicao_arquivo: arquivo
                },
                required: true
            }]
        });

        const dados = autorias.rows.map(row => ({
            proposicao_id: row.proposicoes[0].proposicao_id,
            proposicao_ano: row.proposicoes[0].proposicao_ano,
            proposicao_numero: row.proposicoes[0].proposicao_numero,
            proposicao_sigla: row.proposicoes[0].proposicao_sigla,
            proposicao_titulo: row.proposicoes[0].proposicao_titulo,
            proposicao_ementa: row.proposicoes[0].proposicao_ementa,
            proposicao_apresentacao: row.proposicoes[0].proposicao_apresentacao,
            proposicao_arquivo: row.proposicoes[0].proposicao_arquivo
        }));

        const totalPages = Math.ceil(autorias.count / itens);

        const links = {
            first: `/api/autorias?itens=${itens}&pagina=1&ordenarPor=${orderBy}&ordem=${orderDirection}&ano=${ano}&tipo=${tipo}&arquivo=${arquivo}&autor=${autor}`,
            self: `/api/autorias?itens=${itens}&pagina=${pagina}&ordenarPor=${orderBy}&ordem=${orderDirection}&ano=${ano}&tipo=${tipo}&arquivo=${arquivo}&autor=${autor}`,
            last: `/api/autorias?itens=${itens}&pagina=${totalPages}&ordenarPor=${orderBy}&ordem=${orderDirection}&ano=${ano}&tipo=${tipo}&arquivo=${arquivo}&autor=${autor}`
        };

        return { status: 200, message: `${autorias.count} proposições encontradas`, data: dados, links };
    } catch (error) {
        return { status: 500, message: 'Erro interno do servidor', error: error.name };
    }
}



async function updateAutores(ano) {
    try {

        //remover assim q a cd arrumar o dados abertos    
        const agent = new https.Agent({
            rejectUnauthorized: false
        });

        await proposicoesModel.AutoresProposicoes.destroy({ where: { proposicao_ano: ano } });
        const response = await axios.get(`https://dadosabertos.camara.leg.br/arquivos/proposicoesAutores/json/proposicoesAutores-${ano}.json`, { httpsAgent: agent /*remover assim q a cd arrumar o dados abertos*/ });
        const autores = response.data.dados;

        const autoresParaInserir = autores.map(autor => ({
            proposicao_id: autor.idProposicao,
            proposicao_ano: ano,
            autor_id: autor.idDeputadoAutor,
            autor_nome: autor.nomeAutor,
            autor_partido: autor.siglaPartidoAutor,
            autor_estado: autor.siglaUFAutor,
            autor_assinatura: parseInt(autor.ordemAssinatura),
            autor_proponente: parseInt(autor.proponente)
        }));

        await proposicoesModel.AutoresProposicoes.bulkCreate(autoresParaInserir);

        return { status: 200, message: 'Autores atualizados com sucesso' };
    } catch (error) {
        return { status: 500, message: 'Erro interno do servidor', error: error };
    }
}

async function updateProposicoes(ano) {
    try {

        //remover assim que a CD arrumar os dados abertos    
        const agent = new https.Agent({
            rejectUnauthorized: false
        });

        await proposicoesModel.Proposicoes.destroy({ where: { proposicao_ano: ano } });
        const response = await axios.get(`https://dadosabertos.camara.leg.br/arquivos/proposicoes/json/proposicoes-${ano}.json`, { httpsAgent: agent /*remover assim que a CD arrumar os dados abertos*/ });
        const proposicoes = response.data.dados;

        const proposicoesParaInserir = proposicoes.filter(proposicao => proposicao.siglaTipo !== 'MPV').map(proposicao => ({
            proposicao_id: proposicao.id,
            proposicao_ano: ano,
            proposicao_numero: proposicao.numero,
            proposicao_sigla: proposicao.siglaTipo,
            proposicao_titulo: proposicao.siglaTipo + ' ' + proposicao.numero + '/' + proposicao.ano,
            proposicao_ementa: proposicao.ementa,
            proposicao_apresentacao: proposicao.dataApresentacao,
            proposicao_arquivo: proposicao.ultimoStatus.descricaoSituacao === 'Arquivada' || proposicao.ultimoStatus.descricaoSituacao === 'Transformado em Norma Jurídica' ? true : false
        }));

        await proposicoesModel.Proposicoes.bulkCreate(proposicoesParaInserir);

        return { status: 200, message: 'Proposições atualizadas com sucesso' };
    } catch (error) {
        return { status: 500, message: 'Erro interno do servidor', error: error };
    }
}

async function sync() {
    try {
        await proposicoesModel.Proposicoes.sync({ alter: true });
        await proposicoesModel.AutoresProposicoes.sync({ alter: true });
        return { status: 200, message: 'Tabelas atualizadas' };
    } catch (error) {
        return { status: 500, message: 'Erro interno do servidor', error: error };
    }
}


module.exports = { updateAutores, updateProposicoes, sync, getProposicoes, getAutorias };