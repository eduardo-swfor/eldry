import _ from 'lodash'
import { apiHandler } from '../../helpers/api-handler'
import { registraApontamentoOcorrencia, pesquisaAbertoOcorrenciasParaUsuario } from './utils/ocorrencia-utils'
import Colecoes from '../../data/colecoes.json'
import { buscaPeloId } from './utils/crud-utils'
import StatusOcorrencia from '../../data/status-ocorrencia.json'
import { verificaAutenticacao } from './utils/firebase-helper'

export default apiHandler(handler)

const post = async (req, res) => {
    const email = await verificaAutenticacao(req)  

    await Promise.all(req.body.ids.map(async (id) => {
         const ocorrencia = await buscaPeloId(Colecoes.OCORRENCIAS, id)
         const apontamento = {
            status: StatusOcorrencia.ENCERRADA,
            ocorrencia,
            arquivos: [],
            resposta: 'ENCERRAMENTO AUTOMÁTICO'
         }
         
         await registraApontamentoOcorrencia(apontamento, email)
    }))

    const pendencias = await pesquisaAbertoOcorrenciasParaUsuario(email)    
    return res.status(200).json(pendencias)
}

function handler(req, res) {
    switch (req.method) {
        case 'POST':
            return post(req, res)
        default:
            return res.status(405).end()
    }
}