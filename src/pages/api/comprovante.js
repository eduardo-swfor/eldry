import { handlerCrud, buscaPeloId, deleteDb, listarColecao, incluiRegistro } from './utils/crud-utils'
import { verificaPermissaoRequest } from './verifica-permissao' 
import { verificaAutenticacao } from './utils/firebase-helper'
import { excluiArquivo } from './utils/upload-utils'
import Colecoes from '../../data/colecoes.json'
import { adicionaDiasNaData, dataSemHora, parseData } from '../../utils/DateUtils'

export async function pesquisaUltimosComprovantes() {
    const dataFim = adicionaDiasNaData(1, dataSemHora())
    const dataInicio = adicionaDiasNaData(-2, dataFim)
    const parametros = { 
        dataRegistro: { '$gte': dataInicio, '$lte': dataFim }
    }

    const sort = {
        sort: {
            data: 1
        },  
        limit: 300
    }
    
    return await listarColecao(Colecoes.COMPROVANTES, parametros, sort)
}

export async function pesquisaComprovante(data, tipo, codigoBanco, codigoEmpresa) {
    const parametros = { 
        data,
        tipo,
        "banco.codigo": codigoBanco,
        "empresa.codigo": codigoEmpresa
    }
    
    const ret = await listarColecao(Colecoes.COMPROVANTES, parametros)
    return ret && ret.length > 0 ? ret[0] : null
}

export async function pesquisaComprovanteRelatorio(dataInicio, dataFim, tipo, codigoBanco, codigoEmpresa) {
    let parametros = {}

    if (codigoBanco) {
        parametros['banco.codigo'] = codigoBanco
    }

    if (codigoEmpresa) {
        parametros['empresa.codigo'] = codigoEmpresa
    }

    if (tipo) {
        parametros['tipo'] = tipo
    }

    if (dataInicio || dataFim) {
        parametros.data = {}

        if (dataInicio) {
            parametros.data['$gte'] = parseData(dataInicio)
        }

        if (dataFim) {
            parametros.data['$lte'] = parseData(dataFim)
        }
    }

    const options = {
        sort: {
            data: 1
        },  
        limit: 500
    }
    
    return await listarColecao(Colecoes.COMPROVANTES, parametros, options)
}

export default async function handler(req, res) {  
    if (!await verificaPermissaoRequest(req)){
        return res.status(201).json('$USUÁRIO NÃO TEM PERMISSÃO PARA EXECUTAR ESTA OPERAÇÃO')
    }

    try {
        if (req.method.toUpperCase() === 'DELETE') {
            const email = await verificaAutenticacao(req)
            const comprovante = await buscaPeloId(Colecoes.COMPROVANTES, req.query.id)

            await excluiArquivo(comprovante.arquivo.caminhoSemNome, comprovante.arquivo.nomeGravado)
            
            return await deleteDb(req, res, email, Colecoes.COMPROVANTES)
        } else if (req.method.toUpperCase() === 'GET') {
            const parametros = JSON.parse(req.query.obj)

            if (parametros && parametros.relatorio){
                const parametros = JSON.parse(req.query.obj)
                
                const lista = await pesquisaComprovanteRelatorio(
                    parametros.dataInicio, parametros.dataFim, 
                    parametros.tipo, parametros.codigoBanco, 
                    parametros.codigoEmpresa
                )
                
                return res.status(200).json(lista)
            } else if (parametros && parametros.dadosMassivo){
                const bancos = await listarColecao(Colecoes.BANCOS)
                const tipoComprovantes = (await listarColecao(Colecoes.TIPO_COMPROVANTES)).map(i => i.descricao)
                const empresas = (await listarColecao(Colecoes.EMPRESAS))

                const retorno = { bancos, tipoComprovantes, empresas }
                return res.status(200).json(retorno)
            } else {
                return res.status(200).json(await pesquisaUltimosComprovantes())
            }
        } else if (req.method.toUpperCase() === 'POST') {                        
            if (req.body.params.obj && req.body.params.obj.validacaoMassivo){
                let retorno = []
                const arquivosParaGravar = req.body.params.obj.comprovantes

                for (let indice in arquivosParaGravar) {
                    const item = arquivosParaGravar[indice]

                    const jaGravado = await pesquisaComprovante(
                        parseData(item.data), 
                        item.tipo, 
                        item.banco.codigo, 
                        item.empresa.codigo
                    )

                    if (jaGravado) {
                        retorno.push(item)
                    }
                }
                
                return res.status(201).json(retorno)
            } else {
                const comprovante = req.body.params.obj
                const jaGravado = await pesquisaComprovante(parseData(comprovante.data), comprovante.tipo, comprovante.banco.codigo, comprovante.empresa.codigo)
    
                if (jaGravado) {
                    throw 'Já existe um comprovante cadastrado com estes dados'
                }
    
                return res.status(201).json(`OK`)
            }

        }  else {
            return await handlerCrud(req, res, Colecoes.COMPROVANTES)
        }
    } catch(error) {
        return res.status(201).json(`$${error}`)
    }
}