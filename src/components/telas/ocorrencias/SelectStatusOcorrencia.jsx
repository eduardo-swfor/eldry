import { useEffect, useState } from 'react'
import StatusOcorrencia from '../../../data/status-ocorrencia.json'
import SelectInput from '../../inputs/SelectInput'

export default function SelectStatusOcorrencia({ value='', label='Status', onChange = null, className = null, required=false, itensExcluidos = [], itensPermitidos = [] }) {

    const [valorCombo, setValorCombo] = useState('')
    const itensStatus = (itensPermitidos.length > 0 ? itensPermitidos : Object.values(StatusOcorrencia))
        .filter(i => itensExcluidos.indexOf(i) < 0).map(item => {        
            return {
                descricao: item
            }
        })    

    useEffect(() => {
        setValorCombo(value)
    }, [value])

    return (
        <SelectInput
            label={label}
            className={className}
            dados={itensStatus}
            campoLabel='descricao'
            textoItem={valorCombo ? (valorCombo.descricao ? valorCombo.descricao : valorCombo) : ''}
            required={required}
            value={valorCombo}
            onChange={valor => {
                setValorCombo(valor)

                if (onChange) {
                    onChange(valor?.descricao)
                }
            }}
        />
    )
}