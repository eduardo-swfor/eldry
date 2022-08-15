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

export async function pesquisaDashboard1() {
    const parametros = { 
        $or:[ 
            {criadoPor: email.toUpperCase()}, 
            {responsavelAnterior: email.toUpperCase()}
        ], 
        dataEncerramento: null,
        responsavelAtual: { '$ne': email.toUpperCase() }
    }
    
    const sort = {
        sort: {
            dataUltimaAtualizacao: 1,
            dataHoraRegistro: 1
        }   
    }
    
    return await listarColecao(colecoes.OCORRENCIAS, parametros, sort)
}

apiRoute.use(verificaPermissaoMiddleware)

apiRoute.get(async (req, res) => {    
    if (req.query.obj) {
        const obj = JSON.parse(req.query.obj)

        if (obj.dashboard1) {
            
            return res.status(200).json(sla)
        }
    }

    return await listarDb(req, res, colecao, 'codigo')
})

export default apiRoute