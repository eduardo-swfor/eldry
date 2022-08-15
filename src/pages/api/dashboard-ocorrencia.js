import nextConnect from 'next-connect'
import { incluiRegistro, listarColecao, buscaPeloId, excluiRegistro } from './utils/crud-utils'
import { connectToDatabase } from './utils/mongodb'
import { verificaPermissaoRequest } from './verifica-permissao'
import colecoes from '../../data/colecoes.json'

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

async function pesquisaTotais(dataInicio, dataFim) {
    const { db } = await connectToDatabase()

    const resultado = await db
        .collection(colecoes.OCORRENCIAS)
        .agregate([
            {
                $match : { "dataRegistro": { $gte: dataInicio, $lt: dataFim } }
            },
            {
                $group : {
                    _id : { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    totalSaleAmount: { $sum: { $multiply: [ "$price", "$quantity" ] } },
                    averageQuantity: { $avg: "$quantity" },
                    count: { $sum: 1 }
                }
            }
        ])
        .toArray()

    return resultado
}

//
apiRoute.get(async (req, res) => {    
    const obj = JSON.parse(req.query.obj)

    if (obj.totais) {
        pesquisaTotais(dataInicio, dataFim)
        //return 
    }

    return res.status(201).json('$Informe o tipo do relatório')
})

export default apiRoute