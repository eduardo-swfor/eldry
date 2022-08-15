import If from './If'
import { IconeX } from '../icons' 
import { useEffect, useState } from 'react'

export default function PainelMensagem({titulo, mensagem, onChange=null}) {

    const [ estado, setEstado ] = useState({})

    useEffect(() => {
        setEstado({titulo, mensagem})        
    }, [titulo, mensagem])
    
    return (
        <If exibir={estado.mensagem}>
            <div className={`
                flex border bg-gray-50 border-gray-500
                rounded-t p-2 mt-2

            `}>
                <div className='text-black text-sm font-bold w-full'>
                    {titulo}
                </div>
                <div className={`
                        cursor-pointer hover:text-black
                        hover:shadow-md rounded
                    `}
                    onClick={() => {
                        setEstado({})  
                        
                        if (onChange) {
                            onChange('')
                        }
                    }}
                >
                    {IconeX()}
                </div>
            </div>
            <div className={`
                flex text-lg text-center border-l border-r 
                border-b border-gray-200 text-black
                rounded-b p-2 mb-2

            `}>
                {estado.mensagem}
            </div>
        </If>
    )
}