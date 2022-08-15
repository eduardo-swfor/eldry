import { useEffect, useState } from 'react'
import useAppData from '../../data/hook/useAppData'
import SelectInput from './SelectInput'
import endpoints from '../../data/endpoints.json'

export default function SelectComboColecao({campoLabel, endpoint, value='', label, onChange = null, className = null, required = false}) {

    const [valorCombo, setValorCombo] = useState('')
    const { listarColecao } = useAppData()
    const [itens, setItens] = useState([])
        
    useEffect(() => {
        if (endpoint) {
            listarColecao(endpoint).then(lista => {
                setItens(lista)
            })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [endpoint])

    useEffect(() => {
        setValorCombo(value)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    return (
        <SelectInput
            label={label}
            required={required}
            dados={itens}
            campoLabel={campoLabel}
            textoItem={value ? (value[campoLabel] ? value[campoLabel] : '') : ''}
            value={valorCombo}
            className={className}
            onChange={valor => {
                setValorCombo(valor)

                if (onChange) {
                    onChange(valor)
                }
            }}
        />
    )

}