import Titulo from '../../labels/Titulo'
import tiposOcorrencias from '../../../data/tipos-ocorrencias.json'

export default function TituloOcorrencia({ item, subitem }) {
    return (
        <Titulo>
            {formataTituloOcorrencia(item, subitem)}
        </Titulo>
    )
}

export function formataTituloOcorrencia(item, subitem, ocorrencia = null) {
    if (ocorrencia) {
        return `
                ${ocorrencia.tipoPrincipal} - ${ocorrencia.descricaoTipoPrincipal} > 
                ${ocorrencia.tipoOcorrencia} - ${ocorrencia.descricaoOcorrencia}    
            `
    }

    if (!item && item !== 0) {
        return 'TIPO DE OCORRÊNCIA NÃO INFORMADA'
    }

    if (Array.isArray(item)) {
        const novo = item.map(i => i - 1)

        if (tiposOcorrencias[novo[0]] && tiposOcorrencias[novo[0]].itens[novo[1]]) {
            return `
                ${tiposOcorrencias[novo[0]].codigo} - ${tiposOcorrencias[novo[0]].descricao} > 
                ${tiposOcorrencias[novo[0]].itens[novo[1]].codigo} - ${tiposOcorrencias[novo[0]].itens[novo[1]].descricao}    
            `
        }

    } else {
        const novoItem = item - 1
        const novoSubitem = subitem - 1

        if (tiposOcorrencias[novoItem] && tiposOcorrencias[novoItem].itens[novoSubitem]) {
            return `
                ${tiposOcorrencias[novoItem].codigo} - ${tiposOcorrencias[novoItem].descricao} > 
                ${tiposOcorrencias[novoItem].itens[novoSubitem].codigo} - ${tiposOcorrencias[novoItem].itens[novoSubitem].descricao}    
            `
        }

    }
    
    return 'TIPO DE OCORRÊNCIA NÃO CADASTRADA'
}