import nextConnect from 'next-connect'
import { verificaPermissaoRequest } from './verifica-permissao'
import { verificaAutenticacao } from './utils/firebase-helper'
import { 
    pesquisaApontamentosOcorrencia, registraApontamentoOcorrencia
} from './utils/ocorrencia-utils'
import log from '../../utils/app-log'

const apiRoute = nextConnect({
    onError(error, req, res) {
        res.status(201).json(`$Erro ao processar a requisição ${error}`)
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

apiRoute.get(async (req, res) => {
    try {
        const obj = JSON.parse(req.query.obj)
        
        if (obj.sequencia) {
            const apontamentos = await pesquisaApontamentosOcorrencia(obj.sequencia)

            return res.status(200).json(apontamentos)           
        }

        res.status(200).json([])
    } catch (error) {
        log('prod', error)
        throw error
    }
    
})

apiRoute.post(async (req, res) => {
    const apontamento = req.body.params.obj

    try {
        const email = await verificaAutenticacao(req)

        if (apontamento.multiplos) {
            apontamento.apontamentos.map(async item => {
                await registraApontamentoOcorrencia(item, email)
            })
        } else {
            await registraApontamentoOcorrencia(apontamento, email)
        }

        return res.status(201).json('Registro incluído com sucesso')
    } catch (error) {
        return res.status(201).json(`$${error}`)
    }
})


export default apiRoute