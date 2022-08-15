import { useState } from 'react'

interface CheckboxProps {
    value?: boolean
    label?: string
    onChange?: (p: boolean) => void
    required?: boolean
    className?: string
    readOnly?: boolean
}

export default function CheckboxInput(props: CheckboxProps) {
    const [estado, setEstado] = useState(props.value !== undefined ? props.value : false)

    return (
        <div className={`
            flex flex-row items-center
            ${props.className}
        `}>
            <input 
                type='checkbox' 
                className='cursor-pointer' 
                checked={props.value !== undefined ? props.value : estado}
                onChange={evt => {
                    if (props.readOnly) {
                        return
                    }

                    setEstado(evt.target.checked)

                    if (props.onChange) {
                        props.onChange(evt.target.checked)
                    }
                }} 
            />
            {props.label ? <div className='pl-2 text-sm'>{props.required ? '*' : ''}{props.label}</div> : null}
        </div>
    )
}