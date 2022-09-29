import { useEffect, useState } from 'react'
import { formataMesAno, parseMesAno } from '../../utils/DateUtils'
import CaptionCampo from '../labels/CaptionCampo'

export default function MesAnoInput(props) {   
    const [estado, setEstado] = useState(props.value ? props.value : '')

    useEffect(() => {
        if (props.value && props.value instanceof Date && !isNaN(props.value)) {
            setEstado(formataMesAno(props.value))
        } else {
            if (props.value && props.value.length > 10) {
                const formatado = formataMesAno(props.value)
                setEstado(formatado ? formatado : props.value)
            } else {
                setEstado(props.value == null ? '' : props.value)
            }
        }
    }, [props.value])

    return (
        <div className={`${props.className}`}>
            {!props.label ? null : <CaptionCampo>{(props.required ? '*' : '') + props.label}</CaptionCampo>}
            <input 
                type='text'
                placeholder={props.placeholder}
                autoComplete='nope'
                className={`
                    p-1 placeholder-gray-400 text-gray-600
                    relative ${props.readOnly ? 'bg-gray-50' : 'bg-white'} 
                    rounded text-sm border border-gray-400 outline-none
                    focus:outline-none focus:ring w-full uppercase text-right
                `}

                onChange={evt => {
                    if (props.readOnly) {
                        return
                    }

                    setEstado(evt.target.value)
                    
                    if (props.onChange) {
                        props.onChange(evt.target.value)
                    }
                }}

                value={estado}
                
                onBlur={() => {       
                    if (props.readOnly) {
                        return
                    }

                    if (props.setData) {
                        props.setData('')
                    }

                    if (!estado) {
                        return
                    }
                    
                    const data = parseMesAno(estado.padStart(6, '0'))
                    const valor = data ? formataMesAno(data) : ''
                    setEstado(valor)

                    if (props.setData) {
                        props.setData( parseMesAno(estado.padStart(6, '0')))
                    }


                    if (props.onChange) {
                        props.onChange(valor)
                    }
                }}                
                
            />
        </div>
    )
}