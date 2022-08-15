import nextConnect from 'next-connect'
import { verificaPermissaoRequest } from './verifica-permissao'
import { verificaAutenticacao } from './utils/firebase-helper'
import { 
    pesquisaAbertoOcorrenciasParaUsuario, pesquisaOcorrenciasSemResponsavel,
    pesquisaAguardandoAtualizacoesCaixaEntrada, validaOcorrencia,
    pesquisaOcorrenciaPorParametros, pesquisaOcorrenciasDoUsuarioPorData,
    pesquisaOcorrenciaRelatorio
} from './utils/ocorrencia-utils'
import { buscaPerfilDoUsuario } from './atribuir-perfil'
import { trocaStringParaDateDoObjeto } from '../../utils/DateUtils'

const apiRoute = nextConnect({
    onError(error, req, res) {
        return res.status(201).json(JSON.stringify(error.message))
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
    const obj = JSON.parse(req.query.obj)

    if (obj['relatorio']) {
        const retorno = await pesquisaOcorrenciaRelatorio(trocaStringParaDateDoObjeto(obj))
        return res.status(200).json(retorno)
    } else if (obj['semResponsavel']) {
        const retorno = await pesquisaOcorrenciasSemResponsavel()
        return res.status(200).json(retorno)
    } else if (obj['pesquisaData']) {
        const retorno = await pesquisaOcorrenciasDoUsuarioPorData(obj.email, obj.dataInicio, obj.dataFim)  
        return res.status(200).json(retorno)
    } else if (obj.email) {
        const pendencias = await pesquisaAbertoOcorrenciasParaUsuario(obj.email)
        const aguardando = await pesquisaAguardandoAtualizacoesCaixaEntrada(obj.email)

        return res.status(200).json({
            pendencias,
            aguardando
        })           
    } else if (obj.sequencia) {  
        const retorno = await pesquisaOcorrenciaPorParametros({sequencia: obj.sequencia})            
        const ocorrencia = retorno.length > 0 ? retorno[0] : ''

        if(ocorrencia) {
            const email = await verificaAutenticacao(req)

            if (ocorrencia.envolvidos.indexOf(email) < 0) {
                const perfil = await buscaPerfilDoUsuario(email)
                if (!perfil.areaPagamentos) {
                    return res.status(201).json('$Você não tem permissão para visualizar esta ocorrência')
                }
            }
        }

        return res.status(200).json(ocorrencia)
    }    

    return res.status(200).json([])
    
})

apiRoute.post(async (req, res) => {
    const ocorrencia = req.body.params.obj
        
    try {
        const email = await verificaAutenticacao(req)
        await validaOcorrencia(trocaStringParaDateDoObjeto(ocorrencia), email)
        return res.status(201).json('OK')
    } catch (error) {
        return res.status(201).json(error)
    }
})


export default apiRoute