import nextConnect from 'next-connect'
import { incluiRegistro, listarColecao, buscaPeloId, excluiRegistro } from './utils/crud-utils'
import { verificaPermissaoRequest } from './verifica-permissao'

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
apiRoute.post(async (req, res) => {
    const obj = req.body?.params?.obj
    const resultado = await incluiRegistro(colecao, obj, null, req)

    return res.status(201).json(await buscaPeloId(colecao, resultado.insertedId))
})

//
apiRoute.get(async (req, res) => {    
    return res.status(200).json(await listarColecao(colecao))
})

apiRoute.delete(async (req, res) => {    
    await excluiRegistro(colecao, req.query.id, null, req)    
    
    return res.status(201).json('ok')        
})


export default apiRoute