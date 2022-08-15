import If from './If'
import { IconeX } from '../icons' 
import { useEffect, useState } from 'react'

export default function PainelErro({titulo, mensagemErro, onChange=null}) {

    const [ estado, setEstado ] = useState({})

    useEffect(() => {
        setEstado({titulo, mensagemErro})        
    }, [titulo, mensagemErro])
    
    return (
        <If exibir={estado.mensagemErro}>
            <div className={`
                flex border border-red-500 
                rounded-t p-1

            `}>
                <div className='text-black text-sm font-bold w-full pl-2'>
                    {titulo}
                </div>
                <div className={`
                        cursor-pointer hover:text-red-500 
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
                flex text-lg text-center bg-red-500 
                border-red-800 text-white
                rounded-b p-2 mb-2

            `}>
                {JSON.stringify(estado.mensagemErro)}
            </div>
        </If>
    )
}