import { connectToDatabase } from './utils/mongodb'
import { verificaAutenticacao } from './utils/firebase-helper'
import { buscaPerfilDoUsuario } from './atribuir-perfil'

export async function verificaPermissao(endpoint, method, pagina, email) {
    if (!email) {
        return false
    }
    
    const perfil = await buscaPerfilDoUsuario(email)

    if (!perfil) {
        return false
    } else {
        if (perfil.admin) {
            return true
        }
        
        if (endpoint) {
            const permitido = perfil.endpoints.filter(i => i.route.toLowerCase() == endpoint.toLowerCase())

            if (permitido && permitido.length > 0) {
                if (permitido[0].get && method.toUpperCase() == 'GET') {
                    return true
                } else if (permitido[0].put && method.toUpperCase() == 'PUT') {
                    return true
                } else if (permitido[0].post && method.toUpperCase() == 'POST') {
                    return true
                } else if (permitido[0].delete && method.toUpperCase() == 'DELETE') {
                    return true
                }
            }
        }

        if (pagina) {
            const permitido = perfil.paginas.filter(i => i.route.toLowerCase() == pagina.toLowerCase())
            
            if (permitido && permitido.length > 0 && permitido[0].permitido) {
                return true
            }
        }
    }
    
    

    return false
}

export async function verificaPermissaoRequest(req) {
    let endpoint = req.url

    if (req.url.indexOf('?') >= 0) {
        endpoint = req.url.substring(0, req.url.indexOf('?'))
    }

    const email = await verificaAutenticacao(req)
    const method = req.method

    return verificaPermissao(endpoint, method, '', email)    
}

export default async function handler(req, res) {     
    const email = await verificaAutenticacao(req)

    if (!email) {
        return res.status(201).end('Não autenticado')
    }

    const { db } = await connectToDatabase()

    if (req.method.toUpperCase() === 'GET') {
        const obj = JSON.parse(req.query.obj)
        const temPermissao = await verificaPermissao(obj.endpoint, '', obj.pagina, email)
        return res.status(200).json(temPermissao)
    } else {
        return res.status(405).json('NÃO PERMITIDO')
    }
}