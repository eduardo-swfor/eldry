import nextConnect from 'next-connect'
import { listarColecao } from './utils/crud-utils'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import colecoes from '../../data/colecoes.json'

const apiRoute = nextConnect({
    onError(error, req, res) {
        return res.status(201).json(error)
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Método '${req.method}' não permitido` })
    },
})

apiRoute.post(async (req, res) => {
    const params = req.body
    
    if (params?.token) {
        return res.status(201).json(jwt.verify(params?.token, process.env.JWT_SECRET))
    } if (params?.email) {
        const lista = await listarColecao(colecoes.USUARIOS, { email: params?.email.toUpperCase() })

        if (lista && lista.length > 0) {
            const usuario = lista[0]

            if (usuario && bcrypt.compareSync(params?.senha, usuario.senha)) {
                const token = jwt.sign({ sub: usuario.email }, process.env.JWT_SECRET, { expiresIn: '7d' })
                const retorno = {
                    email: usuario.email,
                    token
                }

                return res.status(201).json(retorno)
            }
        }

    }
    
    throw 'Usuário/Senha incorretos'
})


export default apiRoute