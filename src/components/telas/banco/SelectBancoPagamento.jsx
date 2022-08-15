import { useEffect, useState } from 'react'
import useAppData from '../../../data/hook/useAppData'
import SelectInput from '../../inputs/SelectInput'
import endpoints from '../../../data/endpoints.json'

export default function SelectBancoPagamento({ value='', label='Banco', onChange = null, className = null, required=false}) {

    const [valorCombo, setValorCombo] = useState('')
    const { listarColecao } = useAppData()
    const [itens, setItens] = useState([])
        
    useEffect(() => {
        listarColecao(endpoints.BANCO, {pagamento: true}).then(lista => {
            setItens(lista)
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setValorCombo(value)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    return (
        <SelectInput
            required={required}
            label={label}
            dados={itens}
            campoLabel='nome'
            textoItem={value ? value : ''}
            value={valorCombo}
            onChange={valor => {
                setValorCombo(valor)

                if (onChange) {
                    onChange(valor)
                }
            }}
        />
    )

}