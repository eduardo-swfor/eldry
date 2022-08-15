import { handlerCrud, buscaPorPropriedade, incluiRegistro } from './utils/crud-utils'
import { verificaPermissaoRequest } from './verifica-permissao'
import { getPerfilPadrao } from './perfil'
import log from '../../utils/app-log'

const colecao = 'perfil_usuarios'

export async function buscaPerfilDoUsuario(email, retornarPadrao = true) {
    const perfilUsuario = await buscaPorPropriedade(colecao, 'email', email.toUpperCase())

    if (perfilUsuario && perfilUsuario.length > 0) {
        const perfil = await buscaPorPropriedade('perfis', 'nome', perfilUsuario[0].perfil)

        if (perfil && perfil.length > 0) {
            return perfil[0]
        }
    }

    return retornarPadrao ? await getPerfilPadrao() : null
}

export async function gravaPerfil(email, perfil, req) {
    const obj = {
        email,
        _id_perfil: perfil._id,
        perfil: perfil.nome
    }
    await incluiRegistro(colecao, obj, email, req)
}

export default async function handler(req, res) {  
    if (!await verificaPermissaoRequest(req)){
        return res.status(201).json('$USUÁRIO NÃO TEM PERMISSÃO PARA EXECUTAR ESTA OPERAÇÃO')
    }

    return await handlerCrud(req, res, colecao, {ordem: 'email', campoUnico: 'email', sobrescrever: true})
}