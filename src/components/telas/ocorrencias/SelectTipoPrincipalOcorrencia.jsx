import { useEffect, useState } from 'react'
import tipos from '../../../data/tipos-ocorrencias.json'
import SelectInput from '../../inputs/SelectInput'

export default function SelectTipoPrincipalOcorrencia({ value='', label='Tipo principal', onChange = null, required=false, className = null}) {

    const [valorCombo, setValorCombo] = useState('')   
    const dados = tipos.map(item => {
        item['codigoComDescricao'] = `${item.codigo} - ${item.descricao}`
        return item
    })

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