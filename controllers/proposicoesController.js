const axios = require('axios');
const https = require('https');//remover assim q a cd arrumar o dados abertos

const proposicoesModel = require('../models/proposicoesModel');


async function getAutores(ano) {
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

async function getProposicoes(ano) {
    try {

        //remover assim q a cd arrumar o dados abertos    
        const agent = new https.Agent({
            rejectUnauthorized: false
        });

        await proposicoesModel.Proposicoes.destroy({ where: { proposicao_ano: ano } });
        const response = await axios.get(`https://dadosabertos.camara.leg.br/arquivos/proposicoes/json/proposicoes-${ano}.json`, { httpsAgent: agent /*remover assim q a cd arrumar o dados abertos*/ });
        const proposicoes = response.data.dados;

        const proposicoesParaInserir = proposicoes.map(proposicao => ({
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


module.exports = { getAutores, sync, getProposicoes };