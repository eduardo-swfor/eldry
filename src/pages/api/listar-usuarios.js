import nextConnect from 'next-connect'
import { incluiRegistro, listarColecao, buscaPeloId, excluiRegistro } from './utils/crud-utils'
import { verificaPermissaoRequest } from './verifica-permissao'
import { getPerfilPadrao } from './perfil'
import colecoes from '../../data/colecoes.json'

const colecao = 'responsaveis'

const apiRoute = nextConnect({
    onError(error, req, res) {
        res.status(501).json({ error: `Erro ao processar a requisição! ${error.message}` })
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Método '${req.method}' não permitido` })
    },
})

async function verificaPermissaoMiddleware(req, res, next) {
    if (!await verificaPermissaoRequest(req)){
        return res.status(201).json('$USUÁRIO NÃO TEM PERMISSÃO PARA EXECUTAR ESTA OPERAÇÃO')
    } else {
        next()
    }
}

apiRoute.use(verificaPermissaoMiddleware)

//
apiRoute.get(async (req, res) => { 
    try {
        const usuarios = await listarColecao(colecoes.USUARIOS)
        const perfilUsuarios = await listarColecao(colecoes.PERFIL_USUARIOS)
        const perfilPadrao = await getPerfilPadrao()

        const retorno = usuarios.map(usuario => {
            const perfil = perfilUsuarios.find(p => p.email === usuario.email)

            return {
                email: usuario.email,
                perfil: !perfil?.perfil ? perfilPadrao?.nome : perfil?.perfil
            }
        })

        return res.status(200).json(retorno)    
    } catch (error) {
        return res.status(200).json(`$Erro: ${JSON.stringify(error)}`)    
    }
    
})

export default apiRoute