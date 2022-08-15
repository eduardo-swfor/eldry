import { useRef, useLayoutEffect } from 'react'
import CaptionCampo from '../labels/CaptionCampo'

export default function IntegerInput(props) {
    const permitidos = Array(10).fill(0).map((v,i) => i)
    const referencia = useRef(null)

    useLayoutEffect(() => {        
        const inicio = referencia.current?.selectionStart
        referencia.current.value = props.value ? props.value : ''

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
                placeholder={props.placeholder}
                autoComplete='nope'
                className={`
                    p-1 placeholder-gray-400 text-gray-600
                    relative ${props.readOnly ? 'bg-gray-50' : 'bg-white'} 
                    rounded text-sm border border-gray-400 outline-none
                    focus:outline-none focus:ring w-full text-right                    
                `}

                readOnly={props.readOnly}
                ref={referencia}

                onChange={(evt) => {   
                    if (props.readOnly) {
                        return
                    }

                    let corrigido = referencia.current.value.trim()

                    if (corrigido !== '-' && corrigido) {
                        corrigido = parseInt(referencia.current.value.split('').map(i => permitidos.indexOf(parseInt(i)) >= 0 ? i : '').join(''))
                        corrigido = isNaN(corrigido) ? '' : corrigido
                    }
                    
                    referencia.current.value = corrigido
                    
                    if (props.onChange) {
                        props.onChange(corrigido)
                    }
                }}

                onKeyDown={props.onKeyDown}
                
                onBlur={props.onBlur}
            />
        </div>
    )
}