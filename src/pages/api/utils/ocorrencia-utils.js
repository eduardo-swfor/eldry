import { 
    incluiRegistro, listarColecao, sequencial, 
    buscaPeloId, alteraRegistro, 
    listarColecaoProject } from './crud-utils'
import  { 
    dataAtualSemHora, adicionaDiasNaData, 
    parseData, formataDataHora, dataSemHora
} from '../../../utils/DateUtils'
import StatusOcorrencia from '../../../data/status-ocorrencia.json'
import colecoes from '../../../data/colecoes.json'
import { validaCamposOcorrencia, validaApontamento } from '../../../utils/funcoes-ocorrencias'
import log from '../../../utils/app-log'
import { enviaEmail } from './envio-email'
import _ from 'lodash'
import tiposOcorrencias from '../../../data/tipos-ocorrencias.json'
import moment from 'moment'

export async function pesquisaOcorrenciaRelatorio(objPesquisa) {
    const parametros = {}

    if (objPesquisa.dataInicio || objPesquisa.dataFim) {
        const dataRegistro = {}

        if (objPesquisa.dataInicio) {
            dataRegistro['$gte'] = parseData(objPesquisa.dataInicio)
        }

        if (objPesquisa.dataFim) {
            dataRegistro['$lte'] = parseData(objPesquisa.dataFim)
        }

        parametros.dataRegistro = dataRegistro
    }
    
    const itensParams = [
        'tipoPrincipal', 'tipoOcorrencia', 'sequencia', 'criadoPor', 
        'status', 'criadoPor', 'responsavelAtual', 'empresa.codigo'
    ]

    itensParams.forEach(item => {
        if (objPesquisa[item]) {
            parametros[item] = objPesquisa[item]
        }
    })

    const options = {
        sort: {
            dataRegistro: 1
        },  
        limit: 2000
    }
    
    const dados = await listarColecao(colecoes.OCORRENCIAS, parametros, options)
    return dados.map(o => {
        if (o.tipoOcorrencia === 3.2) {
            return {
                ...o,
                empresa: {
                    codigo: o.empresas.map(e => e.codigo).join(','),
                    nome: o.empresas.map(e => e.nome).join(','),
                }                    
            }
        } else {
            return o
        }
    })
}

export async function pesquisaResponsaveisPorTipoOcorrencia(tipo, grupoEmpresa) {
    return await listarColecao('responsaveis', { codigo: tipo, grupoEmpresa })
}

export async function sequencialOcorrencia() {
    return `${await sequencial('ocorrencia')}/${(new Date()).getFullYear()}`
}

export async function pesquisaOcorrenciasDoUsuarioPorData(email, dataInicio, dataFim, limit=100) {
    const parametros = { 
        $or: [{criadoPor: email.toUpperCase()}, {responsavelAtual: email.toUpperCase()}],
        dataRegistro: { '$gte': parseData(dataInicio), '$lte': parseData(dataFim) }
    }

    log('desenv', `parâmetros da pesquisa de ocorrências=${JSON.stringify(parametros)}`)

    const sort = {
        sort: {
            dataUltimaAtualizacao: 1,
            dataHoraRegistro: 1
        },  
        limit
    }
    
    return await listarColecao(colecoes.OCORRENCIAS, parametros, sort)
}

export async function pesquisaOcorrenciasSemResponsavel() {
    const parametros = { 
        $or: [{responsavelAtual: null}, {responsavelAtual: ''}]
    }

    const sort = {
        sort: {
            dataUltimaAtualizacao: 1,
            dataHoraRegistro: 1
        }
    }
    
    return await listarColecao(colecoes.OCORRENCIAS, parametros, sort)
}

export async function pesquisaAbertoOcorrenciasParaUsuario(email) {
    const parametros = { 
        responsavelAtual: email.toUpperCase(), 
        dataEncerramento: null 
    }

    log('desenv', `parametros=${JSON.stringify(parametros)}`)

    const sort = {
        sort: {
            dataUltimaAtualizacao: 1,
            dataHoraRegistro: 1
        }   
    }
    
    return await listarColecao(colecoes.OCORRENCIAS, parametros, sort)
}

export async function pesquisaOcorrenciaPorParametros(params) {
    return await listarColecao(colecoes.OCORRENCIAS, params)
}

export async function pesquisaAguardandoAtualizacoesCaixaEntrada(email) {
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

export async function pesquisaSlaOcorrencia(codigo) {
    const resultado = await listarColecao('sla', { codigo })

    if (resultado?.length <= 0 || !resultado[0].sla) {
        return { sla:3, textoObservacao: '' }
    } else {
        return resultado[0]
    }
}

export async function registraApontamentoOcorrencia(apontamento, email) {
    const mensagem = validaApontamento(apontamento)

    if (mensagem) {
        throw mensagem
    }

    apontamento.dataHoraRegistro = new Date()
    apontamento.dataRegistro = dataAtualSemHora()
    apontamento.criadoPor = email

    const ocorrencia = await buscaPeloId(colecoes.OCORRENCIAS, apontamento.ocorrencia._id)
    apontamento.ocorrencia = _.cloneDeep(ocorrencia)
    /*
    apontamento.ocorrencia = {
        _id: ocorrencia._id,
        sequencia: ocorrencia.sequencia,
        empresa: {
            _id: ocorrencia.empresa._id,
            codigo: ocorrencia.empresa.codigo,
            nome: ocorrencia.empresa.nome
        }
    }
    */
    
    ocorrencia.quantidadeAtualizacoes++
    const statusOriginal = ocorrencia.status
    ocorrencia.status = apontamento.status
    ocorrencia.envolvidos = _.uniq([...ocorrencia.envolvidos, email])
    
    const alterarResponsavel = () => {
        if ([
            StatusOcorrencia.SOLICITADO_INFORMACOES_ADICIONAIS,
            StatusOcorrencia.INFORMACOES_FORNECIDAS
        ].indexOf(apontamento.status) < 0) {
            return
        }

        
        if (apontamento.status === StatusOcorrencia.SOLICITADO_INFORMACOES_ADICIONAIS) {
            ocorrencia.responsavelAnterior = ocorrencia.responsavelAtual
            ocorrencia.responsavelAtual = ocorrencia.criadoPor
            apontamento.devolveuParaArea = true
        } else {
            const responsavel = ocorrencia.responsavelAnterior
            ocorrencia.responsavelAnterior = ocorrencia.responsavelAtual
            ocorrencia.responsavelAtual = responsavel
        }
    }
    
    apontamento.devolveuParaArea = false
    alterarResponsavel()

    if (StatusOcorrencia.ENCERRADA == apontamento.status) {
        ocorrencia.dataEncerramento = dataAtualSemHora()
        ocorrencia.dataHoraEncerramento = new Date()
    } else if (StatusOcorrencia.REABERTA == apontamento.status) {
        ocorrencia.dataEncerramento = null
        ocorrencia.dataHoraEncerramento = null
    } else if (StatusOcorrencia.REDISTRIBUIDO == apontamento.status) {
        ocorrencia.envolvidos = _.uniq([...ocorrencia.envolvidos, apontamento.novoResponsavel])
        ocorrencia.responsavelAnterior = ocorrencia.responsavelAtual
        ocorrencia.responsavelAtual = apontamento.novoResponsavel
        ocorrencia.responsavelAfc = apontamento.novoResponsavel

        enviaEmail(
            ocorrencia.responsavelAtual, 
            `Ocorrência atualizada ${ocorrencia.sequencia}: ${ocorrencia.descricaoOcorrencia}`, 
            `
                <b>
                O usuário ${email.toLowerCase()} 
                atribuiu a ocorrência de sequência '${ocorrencia.sequencia}' para você,
                para verificar mais detalhes entre na caixa de entrada do portal de pagamentos
                </b>
            `
        )
    }

    if (apontamento.criadoPor === ocorrencia.criadoPor) {
        apontamento.afc = false
    } else {
        apontamento.afc = true
    }

    //Calcula SLA
    if (StatusOcorrencia.ENCERRADA == apontamento.status) {
        let dataInicio = ocorrencia.dataRegistro
        let dataFim
        let sla = 0

        let apontamentos = await pesquisaApontamentosOcorrencia(ocorrencia.sequencia)
        apontamentos.reverse()
        apontamentos.push({...apontamento, dataRegistro: dataSemHora()})

        apontamentos.map(ap => {
            if (!ap.afc) {
                dataInicio = ap.dataRegistro
                dataFim = null
            } else {
                dataFim = ap.dataRegistro
            }

            if (dataInicio && dataFim) {
                dataFim = ap.dataRegistro

                const inicio = moment(dataInicio)
                const fim = moment(ap.dataRegistro)

                const slaCalculado = Math.abs(inicio.diff(fim, 'days'))
                
                if (slaCalculado > sla) {
                    sla = slaCalculado
                }
            }
        })

        ocorrencia.sla = sla
    }
    //

    await alteraRegistro('ocorrencias', ocorrencia, email)

    const registro = await incluiRegistro(colecoes.APONTAMENTOS, apontamento, email)

    if (StatusOcorrencia.ENCERRADA == apontamento.status) {
        enviaEmail(
            apontamento.ocorrencia.criadoPor, 
            `Ocorrência ${apontamento.ocorrencia.sequencia} encerrada`, 
            `
                <b>
                O usuário ${apontamento.criadoPor.toLowerCase()} 
                encerrou ocorrência de número ${apontamento.ocorrencia.sequencia}
                . É possível pesquisar esta ocorrência na tabela de histórico da sua caixa de entrada 
                <br>Resposta: ${apontamento.resposta}
                </b>
            `
        )
    } else {
        enviaEmail(
            apontamento.ocorrencia.criadoPor, 
            `Ocorrência ${apontamento.ocorrencia.sequencia} atualizada`, 
            `
                <b>
                O usuário ${apontamento.criadoPor.toLowerCase()} 
                atualizou a ocorrência de número ${apontamento.ocorrencia.sequencia}
                <br>Status: ${apontamento.status}
                <br>Resposta: ${apontamento.resposta}
                </b>
            `
        )
    }
    
    return registro
}

export async function pesquisaApontamentosOcorrencia(sequencia) {
    log('desenv', `pesquisando apontamentos da sequência ${sequencia}`)
    const parametros = { 
        "ocorrencia.sequencia": sequencia
    }
    
    const sort = {
        sort: {
            dataRegistro: -1,
            dataHoraRegistro: -1
        }   
    }

    const resultado = await listarColecao(colecoes.APONTAMENTOS, parametros, sort)
    return resultado
}

export async function validaDuplicidadeOcorrencia(ocorrencia) {
    const tipoGravado = ocorrencia.tipoOcorrencia.toString().split('.').map(i => ((+i)-1))
    const tipo = tiposOcorrencias[tipoGravado[0]].itens[tipoGravado[1]]


    if (tipo.validaDuplicidade && tipo.validaDuplicidade.length > 0) {
        let parametrosPesquisa = { tipoOcorrencia: ocorrencia.tipoOcorrencia }
        
        tipo.validaDuplicidade.forEach(item => {
            if (item === 'dataRegistro') {
                parametrosPesquisa[item] = dataAtualSemHora()
            } else if (item === 'empresa') {
                parametrosPesquisa[`${item}.codigo`] = ocorrencia[item]['codigo']
            } else {
                parametrosPesquisa[item] = ocorrencia[item]
            }

        })

        const retorno = await listarColecao(colecoes.OCORRENCIAS, parametrosPesquisa)
        return !retorno || !retorno.length ? '' : `Não é possível gravar, pois já foi criado uma ocorrência com os dados informados!`
    }
}

export async function validaOcorrencia(ocorrencia, email) {
    if (!ocorrencia ||! email) {
        throw 'É necessário passar a ocorrência e e-mail para a validação'
    }

    let erros = []
    const camposNaoValidados = validaCamposOcorrencia(ocorrencia)

    if (camposNaoValidados.length > 0) {
        erros.push(`Campos obrigatórios em branco: ${camposNaoValidados.join(', ')}`)
    }

    const resultadoDuplicidade = await validaDuplicidadeOcorrencia(ocorrencia)

    if (resultadoDuplicidade) {
        erros.push(resultadoDuplicidade)
    }

    if (erros.length > 0) {
        throw `$Erros de validação: ${erros.join(', ')}`
    }
}

export async function incluiOcorrencia(ocorrencia, email) {
    await validaOcorrencia(ocorrencia, email)
    const grupoEmpresa = ocorrencia?.empresa ? ocorrencia.empresa?.grupoEmpresa : ''

    const sla = await pesquisaSlaOcorrencia(ocorrencia.tipoOcorrencia)
    ocorrencia.sequencia = await sequencialOcorrencia()
    ocorrencia.dataRegistro = dataAtualSemHora()
    ocorrencia.dataPrevisaoEncerramento = null
    ocorrencia.dataHoraRegistro = new Date()
    ocorrencia.criadoPor = email
    ocorrencia.responsavelAtual = await gravaUltimoResponsavel(grupoEmpresa?.nome, ocorrencia.tipoOcorrencia, email)
    ocorrencia.responsavelAfc = ocorrencia.responsavelAtual
    ocorrencia.dataEncerramento = null
    ocorrencia.dataHoraEncerramento = null
    ocorrencia.status = StatusOcorrencia.NOVA
    ocorrencia.dataUltimaAtualizacao = ocorrencia.dataRegistro
    ocorrencia.slaMaximoCadastrado = sla.sla
    ocorrencia.sla = 0
    ocorrencia.envolvidos = _.uniq([ocorrencia.responsavelAtual, ocorrencia.criadoPor])
    ocorrencia.quantidadeAtualizacoes = 1
    ocorrencia.responsavelAnterior = ocorrencia.criadoPor

    if (ocorrencia.slaMaximoCadastrado) {
        ocorrencia.dataPrevisaoEncerramento = adicionaDiasNaData(ocorrencia.slaMaximoCadastrado, ocorrencia.dataRegistro)
    }

    const retorno = await incluiRegistro(colecoes.OCORRENCIAS, ocorrencia, email)
    ocorrencia._id = retorno.insertedId
    
    if (ocorrencia.responsavelAtual) {
        enviaEmail(
            ocorrencia.responsavelAtual, 
            `Nova ocorrência ${ocorrencia.sequencia}: ${ocorrencia.descricaoOcorrencia}`, 
            `
                <b>
                O usuário ${ocorrencia.criadoPor.toLowerCase()} 
                criou uma nova ocorrência as ${formataDataHora(ocorrencia.dataHoraRegistro)}
                , para verificar mais detalhes entre na caixa de entrada do portal de pagamentos
                </b>
            `
        )
    }
    
    return ocorrencia
}

export async function gravaUltimoResponsavel(grupoEmpresa, tipoOcorrencia, email) {
    let parametrosPesquisa = {
        $and:[ {grupoEmpresa}, {tipoOcorrencia} ]
    }
    const ultimoResponsavel = await listarColecaoProject(colecoes.ULTIMOS_RESPONSAVEIS, { parametrosPesquisa })    

    let emails = (await listarColecaoProject(colecoes.RESPONSAVEIS, { parametrosPesquisa,  project: {email: 1} })).map(i => i.email)        

    if (!emails || emails.length == 0) {
        const novoTipo = +tipoOcorrencia.toString().split('.')[0]
        parametrosPesquisa = {
            $and:[ {grupoEmpresa}, {tipoOcorrencia: novoTipo} ]
        }

        emails = (await listarColecaoProject(colecoes.RESPONSAVEIS, { parametrosPesquisa,  project: {email: 1} })).map(i => i.email)
    }

    let ultimo = null

    if (ultimoResponsavel && ultimoResponsavel.length > 0) {
        ultimo = ultimoResponsavel[0]
    } 
    
    let novoResponsavel = null

    if (emails.length > 0) {
        if (ultimo) {
            const indice = emails.indexOf(ultimo.email)

            if (indice == emails.length - 1) {
                novoResponsavel = emails[0]
            } else {
                novoResponsavel = emails[indice + 1]
            }
        } else {
            novoResponsavel = emails[0]
        }

        if (!ultimo) {            
            const voResponsavel = {
                grupoEmpresa, 
                tipoOcorrencia, 
                email: novoResponsavel
            }

            await incluiRegistro(colecoes.ULTIMOS_RESPONSAVEIS, voResponsavel, email)
        } else {
            ultimo.email = novoResponsavel
            await alteraRegistro(colecoes.ULTIMOS_RESPONSAVEIS, ultimo, email)
        }
    }

    return novoResponsavel
}