import moment from 'moment'
import _ from 'lodash'

export function formataHora(data: Date) {
    return moment(data).format('hh:mm:ss')
}

export function formataData(data) {    
    if (typeof data == 'string' && data.length > 10) {
        return moment(data.toString().substring(0, 10), 'YYYY.MM.DD').format('DD/MM/YYYY')
    }

    if (typeof data == 'string' && data.length == 10) {
        return moment(data.toString().substring(0, 10), 'DD/MM/YYYY').format('DD/MM/YYYY')
    }

    if (data && moment(data).isValid()) {
        return moment(data).format('DD/MM/YYYY')
    } 

    return ''
}

export function formataDataHora(data: Date) {
    return data ? moment(data).format('DD/MM/YYYY hh:mm:ss') : ''
}

export function parseData(data: string, formato = '') {
    if (data) {
        const valor = moment(data, !formato ? 'DD/MM/YYYY' : formato)        
        return valor.isValid() ? valor.toDate() : null
    } else {
        return null
    }    
}

export function parseDataHora(data: string, formato = '') {
    if (data) {
        const valor = moment(data, !formato ? 'DD/MM/YYYY hh:mm:ss' : formato)
        return valor.isValid() ? valor.toDate() : null
    } else {
        return null
    }    
}

export function dataAtualSemHora() {
    return dataSemHora(new Date())
}

export function dataSemHora(data) {
    return moment(data).startOf('day').toDate()
}

export function adicionaDiasNaData(dias, data) {
    return moment(data).add(dias, 'days').toDate()
}

export function adicionaMinutosNaData(minutos, data) {
    return moment(data).add(minutos, 'minutes').toDate()
}

export function trocaStringParaDateDoObjeto(obj, ...camposAdicionais) {
    let novoObj = _.cloneDeep(obj)

    Object.keys(novoObj).map(chave => {        
        if (chave == 'emissao' || chave == 'vencimento' || chave.indexOf('data') == 0 || camposAdicionais.indexOf(chave) >= 0) {
            if (typeof novoObj[chave] === 'string') {
                let data = novoObj[chave]

                if (data.length == 10) {
                    data = parseData(novoObj[chave])
                } else {
                    data = parseData(formataData(novoObj[chave]))
                }
    
                if (data) {
                    novoObj[chave] = data
                }
            }
        } else if (chave.indexOf('dataHora') == 0 || camposAdicionais.indexOf(chave) >= 0) {
            if (typeof novoObj[chave] === 'string') {
                const data = parseDataHora(novoObj[chave])
    
                if (data) {
                    novoObj[chave] = data
                }
            }
        }
        
    })

    return novoObj
}

export function trocaDateParaStringDoObjeto(obj, ...camposAdicionais) {
    const novoObj = _.cloneDeep(obj)
    
    Object.keys(novoObj).forEach(chave => {
        if (chave == 'emissao' || chave == 'vencimento' || chave.indexOf('data') == 0 || camposAdicionais.indexOf(chave) >= 0) {
            const valor = novoObj[chave]
            
            if (valor && valor instanceof Date) {
                const dataStr = formataData(valor)
    
                if (dataStr) {
                    novoObj[chave] = dataStr
                }
            }            
        } else if (chave.indexOf('dataHora') == 0) {
            const valor = novoObj[chave]
            
            if (valor && valor instanceof Date) {
                const dataStr = formataDataHora(valor)
    
                if (dataStr) {
                    novoObj[chave] = dataStr
                }
            }            
        }
    })

    return novoObj
}