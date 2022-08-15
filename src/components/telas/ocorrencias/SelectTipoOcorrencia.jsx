import { useEffect, useState } from 'react'
import tipos from '../../../data/tipos-ocorrencias.json'
import SelectInput from '../../inputs/SelectInput'
import _ from 'lodash'

export default function SelectTipoOcorrencia({ value='', label='Tipo', onChange = null, required=false, className = null}) {

    const [valorCombo, setValorCombo] = useState('')   
    const dados = _.flatten(tipos.map(item => {
        return item.itens.map(subitem => {
            subitem['codigoComDescricao'] = `${subitem.codigo} - ${subitem.descricao}`
            return subitem
        })
    }))

    useEffect(() => {
        setValorCombo(value)
    }, [value])

    return (
        <SelectInput
            label={label}
            dados={dados}
            className={className}
            campoLabel='codigoComDescricao'
            textoItem={valorCombo == null ? '' : valorCombo['codigoComDescricao']}
            required={required}
            value={valorCombo == null ? '' : valorCombo['codigoComDescricao']}
            onChange={valor => {
                setValorCombo(valor)

                if (onChange) {
                    onChange(valor?.codigo)
                }
            }}
        />
    )

}