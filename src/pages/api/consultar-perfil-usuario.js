import nextConnect from 'next-connect'
import { buscaPorPropriedade, listarColecaoProject } from './utils/crud-utils'
import { getPerfilPadrao } from './perfil'
import { verificaAutenticacao } from './utils/firebase-helper'
import { buscaPerfilDoUsuario, gravaPerfil } from './atribuir-perfil'
import colecoes from '../../data/colecoes.json'

const colecao = 'sla'

const apiRoute = nextConnect({
    onError(error, req, res) {
        res.status(201).json({ error: `$Erro! ${JSON.stringify(error)}` })
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `$Método '${req.method}' não permitido` })
    },
})

export async function pesquisaPerfilUsuario(email) {
    if (!email) {
        return null
    }

    const perfis = await buscaPorPropriedade('perfil_usuarios', 'email', email.toUpperCase())
        
    if (perfis && perfis.length) {
        const perfilUsuario = perfis[0]
        const perfil = await buscaPorPropriedade('perfis', 'nome', perfilUsuario.perfil)
        
        return perfil.length > 0 ? perfil[0] : {} 
    }

    return null
}

export async function pesquisaUsuariosAreaPagamentos() {
    const perfis = await buscaPorPropriedade('perfis', 'areaPagamentos', true)
    const listaCondicoes = perfis.map(item => {
        return {perfil: item.nome.toUpperCase()}
    })
    
    const parametrosPesquisa = { 
        $or: listaCondicoes
    }

    const options = {
        sort: {
            email: 1
        }
    }    
    
    return (await listarColecaoProject(colecoes.PERFIL_USUARIOS, { parametrosPesquisa, options, project: {email: 1} })).map(i => i.email)
}

apiRoute.get(async (req, res) => {
    const params = JSON.parse(req.query.obj)

    if (params && params.email) {        
        const perfil = await pesquisaPerfilUsuario(params.email)
        
        if (perfil) {
            return res.status(200).json(perfil)
        } else {
            const perfilPadrao = await getPerfilPadrao()
            
            if (perfilPadrao) {
                return res.status(200).json(perfilPadrao)
            }
        }
    } else if (params?.pagamentos) {
        const dados = await pesquisaUsuariosAreaPagamentos()
        return res.status(200).json(dados)
    }

    return res.status(200).json([])
})

apiRoute.post(async (req, res) => {    
    const email = await verificaAutenticacao(req, res)

    if (!email) {
        return res.status(401).end('Not authenticated')
    }

    const params = JSON.parse(req.query.obj)
    
    if (params && params.email) {
        const perfil = buscaPerfilDoUsuario(params.email, false)
        
        if (!perfil) {
            gravaPerfil(params.email, getPerfilPadrao(), req)
        }
    }

    return res.status(200).end()
})

export default apiRoute