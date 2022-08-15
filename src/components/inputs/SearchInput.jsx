import { useLayoutEffect, useRef } from 'react'

export default function SearchInput(props) {
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
            <span className={`
                    z-10 leading-snug font-normal absolute 
                    text-center text-gray-400 bg-transparent
                    rounded text-base items-center justify-center
                    w-8 py-1
                `}
            >
                <i className="fas fa-search cursor-pointer" />
            </span>
            <input 
                type='text'
                autoComplete='nope'
                placeholder={props.placeholder}
                className={`
                    py-1 px-5 placeholder-gray-400 text-gray-600
                    relative ${props.readOnly ? 'bg-gray-50' : 'bg-white'} 
                    rounded text-sm border border-gray-400 outline-none
                    focus:outline-none focus:ring w-full
                    uppercase
                `}

                readOnly={props.readOnly}
                
                ref={referencia}
                
                onChange={(evt) => {                    
                    if (props.readOnly) {
                        return
                    }
                    
                    if (props.onChange) {
                        props.onChange(evt.target.value.toUpperCase())
                    }
                }}

                onKeyDown={props.onKeyDown}

                onBlur={evt => {
                    if (props.readOnly) {
                        return
                    }

                    if (props.onChange) {
                        props.onChange(referencia.current.value.toUpperCase())
                    }                    
                    
                    if (props.onBlur) {
                        props.onBlur(referencia.current.value)
                    }
                    
                }}
            />
        </div>
    )
}