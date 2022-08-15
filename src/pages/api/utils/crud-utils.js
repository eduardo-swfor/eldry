import { connectToDatabase } from './mongodb'
import { verificaAutenticacao } from './firebase-helper'
import { ObjectId } from 'mongodb'
import _ from 'lodash'
import log from '../../../utils/app-log'
import { dataSemHora, trocaStringParaDateDoObjeto } from '../../../utils/DateUtils'

export async function sequencial(codigoSequencial) {
    const { db } = await connectToDatabase()
    const colecaoSequencia = 'sequenciais'

    const codigo = `${codigoSequencial}_${new Date().getFullYear()}`

    const resultado = await db
        .collection(colecaoSequencia)
        .findOne({ codigo })

    if (!resultado) {
        await db
            .collection(colecaoSequencia)
            .insertOne({ codigo, sequencia: 1 }) 

        return 1
    } else {
        resultado.sequencia += 1
        const filter = { _id: ObjectId(resultado._id) }
        delete resultado._id

        await db
            .collection(colecaoSequencia)
            .replaceOne(filter, resultado)

        return resultado.sequencia
    }

}

export async function buscaPeloId(colecao, id) {
    const filter = (typeof id) == 'string' ? { _id: ObjectId(id) } : { _id: id }
    const { db } = await connectToDatabase()

    const resultado = await db
        .collection(colecao)
        .findOne(filter)
    
    return resultado
}

export async function buscaPorPropriedade(colecao, nomePropriedade, valor) {    
    const { db } = await connectToDatabase()   
    const filter = {}
    filter[nomePropriedade] = valor

    const dados = await db
        .collection(colecao)
        .find(filter)
        .toArray()

    return dados
}

async function registraLog(colecao, objeto, tipoOperacao, usuario, req) {
    const { db } = await connectToDatabase()

    const novoObj = _.cloneDeep(objeto)
    const _id =  novoObj._id ? novoObj._id.toString() : ''
    novoObj._id = _id    

    const registroLog = {
        usuario,
        data: new Date(),
        tipoOperacao,
        colecao,
        rota: req ? req.url : '',
        objeto: {
            ...novoObj
        }
    }

    await db.
        collection('log').
        insertOne(registroLog)
}

export async function listarColecao(colecao, parametrosPesquisa={}, options={}) {
    const { db } = await connectToDatabase()
    const limit = options.limit ? options.limit : 0

    const resultado = await db
        .collection(colecao)        
        .find(parametrosPesquisa, options)
        .limit(limit)
        .toArray()

    return resultado
}

export async function listarColecaoProject(colecao, { parametrosPesquisa={}, options={}, limit=0, project={} }) {
    const { db } = await connectToDatabase()

    log('desenv', `parametrosPesquisa=${JSON.stringify(parametrosPesquisa)}`)

    const resultado = await db
        .collection(colecao)        
        .find(parametrosPesquisa, options)
        .limit(limit)
        .project(project)
        .toArray()

    return resultado
}

export async function listarDb(req, res, colecao, ordem) {
    const { db } = await connectToDatabase()
    const params = req.query?.obj ? JSON.parse(req.query.obj) : {}

    const options = ordem ? 
        JSON.parse(`{
            "sort": {"${ordem}": 1}   
        }`) :
        {}

    const dados = await listarColecao(colecao, params, options)    
    return res.status(200).json(dados)
}

export async function incluiRegistro(colecao, obj, email, req) {
    const { db } = await connectToDatabase()

    obj.dataRegistro = dataSemHora()
    obj.dataHoraRegistro = new Date()
    obj.criadoPor = email

    const resultado = await db
        .collection(colecao)
        .insertOne(obj) 

    if (!email && req) {
        email = await verificaAutenticacao(req)
    }
    
    if (email) {
        obj._id = resultado.insertedId
        await registraLog(colecao, obj, 'I', email, req)
    }
    
    return resultado
}

export async function postDb(req, res, email, colecao, campoUnico, sobrescrever) {
    const obj = trocaStringParaDateDoObjeto(req.body.params.obj)

    if (campoUnico) {            
        const pesquisa = await buscaPorPropriedade(colecao, campoUnico, obj[campoUnico])

        if (pesquisa && pesquisa.length) {
            if (!sobrescrever) {
                return res.status(201).end('$Registro duplicado')
            } else {
                return putDb(req, res, email, colecao, campoUnico, sobrescrever)
            }
        }
    }
    
    const resultado = await incluiRegistro(colecao, obj, email, req)
    

    if (resultado.acknowledged){
        return res.status(201).json(await buscaPeloId(colecao, resultado.insertedId))
    } else {
        return res.status(409).end()
    }
}

export async function alteraRegistro(colecao, obj, email, req) {
    const { db } = await connectToDatabase()

    if (!email && req) {
        email = await verificaAutenticacao(req)
    }

    const filter = { _id: ObjectId(obj._id) }
    delete obj._id

    obj.dataAlteracaoRegistro = dataSemHora()
    obj.dataHoraAlteracaoRegistro = new Date()
    obj.alteradoPor = email

    const resultado = await db
        .collection(colecao)
        .replaceOne(filter, obj)

    if (resultado.modifiedCount) {        
        const voPesquisa = await buscaPeloId(colecao, filter._id)
        registraLog(colecao, voPesquisa, 'U', email, req)

        return voPesquisa
    } else {
        return null
    }
}

export async function putDb(req, res, email, colecao, campoUnico, sobrescrever) {    
    const { db } = await connectToDatabase()    
        
    let obj = trocaStringParaDateDoObjeto(req.body.params.obj)

    if ((typeof obj) == 'string') {
        obj = JSON.parse(obj)
    }
            
    if (campoUnico) {                    
        const pesquisa = await buscaPorPropriedade(colecao, campoUnico, obj[campoUnico])
        
        if (pesquisa && pesquisa.length && pesquisa[0]._id.toString() !== obj._id) {            
            if (sobrescrever) {
                obj = {...obj, _id: pesquisa[0]._id}
            } else {
                return res.status(201).end('$Registro duplicado')
            }

        }        
    }

    const resultado = await alteraRegistro(colecao, obj, email, req)

    if (!resultado) {
        return res.status(404).json('Não encontrado')    
    } else {
        return res.status(201).json(resultado)
    }
}

export async function excluiRegistro(colecao, id, email, req) {
    if (!email && req) {
        email = await verificaAutenticacao(req)
    }

    const { db } = await connectToDatabase()
    const filter = { _id: ObjectId(id) }
    const voPesquisa = await buscaPeloId(colecao, filter._id)

    const resultado = await db
        .collection(colecao)
        .deleteOne(filter)

    if (resultado.deletedCount) {
        registraLog(colecao, voPesquisa, 'D', email, req)
    }

    return resultado
}

/*
export async function excluiPorPropriedade(colecao, nomePropriedade, valor, email, req) {
    if (!email && req) {
        email = await verificaAutenticacao(req)
    }

    const { db } = await connectToDatabase()
    const filter = { nomePropriedade: valor }
    const resultadoPesquisa = await buscaPorPropriedade(colecao, nomePropriedade, valor)

    if (resultadoPesquisa && resultadoPesquisa.length > 0) {
        const resultado = await db
            .collection(colecao)
            .deleteMany(filter)
    
        if (resultado.deletedCount) {
            resultadoPesquisa.map(async vo => {
                await registraLog(colecao, vo, 'D', email, req)
            })
        }
    
        return resultado
    } else {
        return null
    }
}
*/

export async function deleteDb(req, res, email, colecao) {    
    log('desenv', `excluindo id=${req.query.id}`)
    const resultado = await excluiRegistro(colecao, req.query.id, email, req)

    if (resultado.deletedCount) {
        log('desenv', `id ${req.query.id} excluído com sucesso`)
        return res.status(200).json('ok')
    } else {
        log('desenv', `id ${req.query.id} não localizado, resultado=${JSON.stringify(resultado)}`)

        return res.status(404).json('não encontrado')
    }
}


export async function handlerCrud(req, res, colecao, {ordem = null, campoUnico = null, sobrescrever = null}) {     
    const email = await verificaAutenticacao(req, res)

    if (!email) {
        log('desenv', 'Usuário não autenticado')
        return res.status(401).end('Not authenticated')
    }

    if (req.method.toUpperCase() === 'GET') {        
        return await listarDb(req, res, colecao, !ordem ? 'dataRegistro' : ordem)
    } else if (req.method.toUpperCase() === 'POST') {   
        return await postDb(req, res, email, colecao, campoUnico, sobrescrever)
    } else if (req.method.toUpperCase() === 'PUT') { 
        return await putDb(req, res, email, colecao, campoUnico, sobrescrever)        
    } else if (req.method.toUpperCase() === 'DELETE') {
        return await deleteDb(req, res, email, colecao)
    } else {
        return res.status(405).json('NÃO PERMITIDO')
    }

}