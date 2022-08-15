import { handlerCrud } from './utils/crud-utils'
import {verificaPermissaoRequest} from './verifica-permissao' 
import colecoes from '../../data/colecoes.json'

export default async function handler(req, res) {  
    if (!await verificaPermissaoRequest(req)){
        return res.status(201).json('$USUÁRIO NÃO TEM PERMISSÃO PARA EXECUTAR ESTA OPERAÇÃO')
    }

    return await handlerCrud(req, res, colecoes.TIPO_COMPROVANTES, {ordem: 'descricao', campoUnico: 'descricao'})
}