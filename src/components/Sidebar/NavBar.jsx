import { useRouter } from 'next/router'
import { useState } from 'react'
import { IconeList } from '../icons'
import BotaoSair from '../botoes/BotaoSair'
import Titulo from '../labels/Titulo'

export default function NavBar({clickMenu=null}) {
    const [cssMenu, setCssMenu] = useState('md:ml-64')
    const router = useRouter()
    
    return (
        <div className={`
            bg-gradient-to-br from-blue-900 to-blue-200 shadow-sm md:ml-64 flex p-3
            justify-between items-start align-middle h-36
            
        `}>
            <div className={`
                flex flex-row`}
            >
                <Titulo className='text-white font-bold'>Portal AFC</Titulo>

            </div>
            <div>                
                <button 
                    className='md:hidden bg-gray-200 rounded'
                    onClick={() => {
                        if (clickMenu) {
                            clickMenu()
                            setCssMenu(cssMenu === 'md:ml-64' ? 'ml-64' : 'md:ml-64')
                        }
                    }}
                >
                    {IconeList(8)}
                </button>
                <BotaoSair className='hidden md:block ml-2' />
            </div>
        </div>
    )
}