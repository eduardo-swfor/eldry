import nextConnect from 'next-connect'
import { incluiRegistro, listarDb, alteraRegistro } from './utils/crud-utils'
import { verificaPermissaoRequest } from './verifica-permissao'
import { pesquisaSlaOcorrencia } from './utils/ocorrencia-utils'

const colecao = 'sla'

const apiRoute = nextConnect({
    onError(error, req, res) {
        res.status(500).json({ error: `Erro! ${error.message}` })
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

function incluiItem(item, req) {
    if(item.itens) {
        item.itens.map(filho => incluiItem(filho))
        delete item.itens
    }

    if (!item._id) {
        incluiRegistro(colecao, item, null, req)
    } else {
        alteraRegistro(colecao, item, null, req)
    }
}

apiRoute.post(async (req, res) => {
    const obj = req.body.params.obj
    
    if (obj) {
        Object.values(obj).map(item => {
            incluiItem(item, req)
        })
    }

    res.status(200).json('ok')
})

apiRoute.get(async (req, res) => {    
    if (req.query.obj) {
        const obj = JSON.parse(req.query.obj)

        if (obj.codigo) {
            const sla = await pesquisaSlaOcorrencia(parseFloat(obj.codigo))            
            return res.status(200).json(sla)
        }
    }

    return await listarDb(req, res, colecao, 'codigo')
})

export default apiRoute