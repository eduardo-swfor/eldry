import { useRef, useLayoutEffect } from 'react'
import { formataNumeroMilhar, parseNumeroFormatado } from '../../utils/NumeroUtils'
import CaptionCampo from '../labels/CaptionCampo'


export default function DoubleInput(props) {
    const permitidos = Array(10).fill(0).map((v,i) => i.toString())
    permitidos.push(',', '.')   

    const referencia = useRef(null)

    useLayoutEffect(() => {        
        const inicio = referencia.current?.selectionStart
        referencia.current.value = props.value ? formataNumeroMilhar(props.value) : ''

        if (inicio) {
            referencia.current.selectionStart = inicio
            referencia.current.selectionEnd = inicio
        }

    }, [props.value])

    return (
        <div className={`${props.className}`}>
            {!props.label ? null : <CaptionCampo>{(props.required ? '*' : '') + props.label}</CaptionCampo>}
            <input 
                type='text'
                autoComplete='nope'
                placeholder={props.placeholder}
                className={`
                    p-1 placeholder-gray-400 text-gray-600
                    relative ${props.readOnly ? 'bg-gray-50' : 'bg-white'} 
                    rounded text-sm border border-gray-400 outline-none 
                    focus:outline-none focus:ring w-full text-right uppercase
                `}

                readOnly={props.readOnly}
                ref={referencia}

                onChange={(evt) => {                    
                    if (props.readOnly) {
                        return
                    }
                    
                    let corrigido = referencia.current.value.trim()

                    if (corrigido !== '-' && corrigido) {
                        corrigido = referencia.current.value.split('').map(i => permitidos.indexOf(i) >= 0 ? i : '').join('')
                        corrigido = isNaN(corrigido) ? '' : corrigido
                    }
                    
                    referencia.current.value = corrigido
                }}

                onKeyDown={props.onKeyDown}
                
                onBlur={evt => {
                    const valor = parseNumeroFormatado(referencia.current.value)
                    referencia.current.value = formataNumeroMilhar(valor)

                    if (props.onChange) props.onChange(valor)
                    if (props.onBlur) props.onBlur(valor)
                }}
            />
        </div>
    )
}