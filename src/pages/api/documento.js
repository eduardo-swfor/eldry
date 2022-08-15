import { handlerCrud, buscaPeloId, deleteDb } from './utils/crud-utils'
import { verificaPermissaoRequest } from './verifica-permissao' 
import { verificaAutenticacao } from './utils/firebase-helper'
import { excluiArquivo } from './utils/upload-utils'
import Colecoes from '../../data/colecoes.json'

export default async function handler(req, res) {  
    if (!await verificaPermissaoRequest(req)){
        return res.status(201).json('$USUÁRIO NÃO TEM PERMISSÃO PARA EXECUTAR ESTA OPERAÇÃO')
    }

    try {
        if (req.method.toUpperCase() === 'DELETE') {
            const email = await verificaAutenticacao(req)
            const mensagem = await buscaPeloId(Colecoes.DOCUMENTOS, req.query.id)
            await excluiArquivo(mensagem.arquivo.caminhoSemNome, mensagem.arquivo.nomeGravado)
            
            return await deleteDb(req, res, email, Colecoes.DOCUMENTOS)
        } else {
            return await handlerCrud(req, res, Colecoes.DOCUMENTOS, {ordem: 'descricao'})
        }
    } catch(error) {
        return res.status(201).json(`$${error}`)
    }
}