import { handlerCrud, buscaPorPropriedade } from './utils/crud-utils'
import { verificaPermissaoRequest } from './verifica-permissao' 

const colecao = 'perfis'

export async function getPerfilPadrao() {
    const perfis = await buscaPorPropriedade(colecao, 'padrao', true)

    if (perfis && perfis.length > 0) {
        return perfis[0]
    }

    return {
        nome: 'PADRÃO',
        padrao: true, 
        admin: false,
        areaPagamentos: false, 
        paginas: [], 
        endpoints:[]
    }
}

export default async function handler(req, res) { 
    if (!await verificaPermissaoRequest(req)){
        return res.status(201).json('$USUÁRIO NÃO TEM PERMISSÃO PARA EXECUTAR ESTA OPERAÇÃO')
    }
    
    return await handlerCrud(req, res, colecao, {ordem: 'nome', campoUnico: 'nome'})
}