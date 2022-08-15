import { handlerCrud, buscaPeloId, deleteDb, listarColecao } from './utils/crud-utils'
import { verificaPermissaoRequest } from './verifica-permissao' 
import { verificaAutenticacao } from './utils/firebase-helper'
import { excluiArquivo } from './utils/upload-utils'
import Colecoes from '../../data/colecoes.json'
import { dataSemHora } from '../../utils/DateUtils'

export async function pesquisaMensagensDoDia() {
    const parametros = {
        dataInicio: { $lte: new Date() },
        dataFim: { $gte: dataSemHora() }
    }
    
    const retorno = await listarColecao(Colecoes.MENSAGENS, parametros)
    return retorno
}

export default async function handler(req, res) {  
    if (!await verificaPermissaoRequest(req)){
        return res.status(201).json('$USUÁRIO NÃO TEM PERMISSÃO PARA EXECUTAR ESTA OPERAÇÃO')
    }
    
    try {
        if (req.method.toUpperCase() === 'DELETE') {
            const email = await verificaAutenticacao(req)
            const mensagem = await buscaPeloId(Colecoes.MENSAGENS, req.query.id)
            await excluiArquivo(mensagem.arquivo.caminhoSemNome, mensagem.arquivo.nomeGravado)
            
            return await deleteDb(req, res, email, Colecoes.MENSAGENS)
        } else if (req.method.toUpperCase() === 'GET') {
            const obj = JSON.parse(req.query.obj)

            if (obj.diario) {
                return res.status(200).json(await pesquisaMensagensDoDia())
            } else {
                return await handlerCrud(req, res, Colecoes.MENSAGENS, {ordem: 'dataFim'})    
            }
        } else {
            return await handlerCrud(req, res, Colecoes.MENSAGENS, {ordem: 'dataFim'})
        }
    } catch(error) {        
        return res.status(201).json(`$${error}`)
    }
}