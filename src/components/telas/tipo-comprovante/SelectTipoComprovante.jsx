import { useEffect, useState } from 'react'
import useAppData from '../../../data/hook/useAppData'
import SelectInput from '../../inputs/SelectInput'
import endpoints from '../../../data/endpoints.json'

export default function SelectTipoComprovante({ value='', label='Tipo comprovante', onChange = null, className = null, required}) {

    const [valorCombo, setValorCombo] = useState('')
    const { listarColecao } = useAppData()
    const [itens, setItens] = useState([])
        
    useEffect(() => {
        listarColecao(endpoints.TIPO_COMPROVANTE).then(lista => {
            setItens(lista)
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setValorCombo(value)
    }, [value])

    return (
        <SelectInput
            label={label}
            required={required}
            dados={itens}
            campoLabel='descricao'
            textoItem={value ? value : ''}
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