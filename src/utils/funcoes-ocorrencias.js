import TipoOcorrencias from '../data/tipos-ocorrencias.json'
import Campos from '../data/campos-ocorrencia.json'
import StatusOcorrencia from '../data/status-ocorrencia.json'
import { validaCnpj } from './funcoes-gerais'

export function validaCamposOcorrencia(ocorrencia) {
    const tipoGravado = ocorrencia.tipoOcorrencia.toString().split('.').map(i => ((+i)-1))
    const tipo = TipoOcorrencias[tipoGravado[0]].itens[tipoGravado[1]]
    
    if (tipo.campos) {
        return tipo.campos.map(campo => {
            if(ocorrencia[campo.nome] && Campos[campo.nome].tipo === 'cnpj') {
                if (!validaCnpj(ocorrencia[campo.nome])) {
                    return 'CNPJ inválido'
                }
            }

            if (!campo.required) {
                return ''
            } else if (campo.required && !ocorrencia[campo.nome]) {
                return Campos[campo.nome].titulo
            } else if (campo.required && ocorrencia[campo.nome] && Array.isArray(ocorrencia[campo.nome]) && ocorrencia[campo.nome].length == 0){
                return Campos[campo.nome].titulo
            } else {
                return ''
            }

        }).filter(i => i.length > 0)
    }

    return []
}

export function validaApontamento(apontamento) {
    if (!apontamento.status) {
        return 'É necessário informar o status'
    }

    if (apontamento.status == StatusOcorrencia.ENCERRADA && !apontamento.resposta) {
        return 'É necessário informar uma resposta'
    }

    if (apontamento.status == StatusOcorrencia.REDISTRIBUIDO && !apontamento.novoResponsavel) {
        return 'É necessário informar para qual usuário a ocorrência será distribuída'
    }

    if (apontamento.status == StatusOcorrencia.SOLICITADO_INFORMACOES_ADICIONAIS && !apontamento.resposta) {
        return 'É necessário informar uma resposta'
    }

    return ''
}