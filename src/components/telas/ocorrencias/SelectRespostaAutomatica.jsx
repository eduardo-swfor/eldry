import { useEffect, useState } from 'react'
import tipos from '../../../data/tipos-ocorrencias.json'
import SelectInput from '../../inputs/SelectInput'
import _ from 'lodash'
import useAppData from '../../../data/hook/useAppData'
import endpoints from '../../../data/endpoints.json'

export default function SelectRespostaAutomatica({ value='', label='Resposta automática', onChange = null, required=false, className = null}) {

    const [valorCombo, setValorCombo] = useState('')
    const { axiosGet } = useAppData()
    const [lista, setLista] = useState([])

    useEffect(() => {
        axiosGet(endpoints.RESPOSTA_AUTOMATICA).then(setLista)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setValorCombo(value)
    }, [value])

    return (
        <SelectInput
            label={label}
            dados={lista}
            className={className}
            campoLabel='descricao'
            textoItem={valorCombo == null ? '' : valorCombo}
            required={required}
            value={valorCombo == null ? '' : valorCombo['codigoComDescricao']}
            onChange={valor => {
                setValorCombo(valor)

                if (onChange) {
                    onChange(valor?.descricao)
                }
            }}
        />
    )

}