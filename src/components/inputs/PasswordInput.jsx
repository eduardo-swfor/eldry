import { useLayoutEffect, useRef } from "react"
import CaptionCampo from '../labels/CaptionCampo'

export default function PasswordInput(props) {
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
                type='password'
                placeholder={props.placeholder}
                autoComplete='nope'
                className={`
                    p-1 placeholder-gray-400 text-gray-600
                    relative ${props.readOnly ? 'bg-gray-50' : 'bg-white'} 
                    rounded text-sm border border-gray-400 outline-none
                    focus:outline-none focus:ring w-full
                `}

                readOnly={props.readOnly}
                ref={referencia}
                
                onChange={evt => {                    
                    if (props.readOnly) {
                        return
                    }
                    
                    if (props.onChange) {
                        props.onChange(referencia.current.value)
                    }
                }}

                onKeyDown={props.onKeyDown}

                onBlur={evt => {
                    if (props.readOnly) {
                        return
                    }

                    if (props.onChange) {
                        props.onChange(referencia.current.value)
                    }                    
                    
                    if (props.onBlur) {
                        props.onBlur(referencia.current.value)
                    }
                    
                }}
            />
        </div>
    )
}