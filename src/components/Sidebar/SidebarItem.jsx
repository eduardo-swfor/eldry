import { useRouter } from "next/router"
import appLog from "../../utils/app-log"
import { useEffect, useState } from "react"
import { getUrl } from '../../utils/axios-helper'

export default function SidebarItem({ route, title, icone, paginasPermitidas=[], className='' }) {
    const router = useRouter()
    const [rotaCalculada, setRotaCalculada] = useState('')

    useEffect(() => {
        let rota = router.pathname
        
        if (rota.indexOf('[') >= 0) {
            rota = rota.substring(0, rota.indexOf('['))
            const parametro = Object.keys(router.query).pop()
            rota = `${rota}${router.query[parametro]}`
        } 
        setRotaCalculada(rota)
    }, [router.pathname, router.query])
    //
    const getJsxItem = () => {
        return (            
            <div className={`
                flex flex-row ml-4 py-2 font-bold text-sm 
                cursor-pointer rounded 
                ${className}
                ${rotaCalculada === route ? 
                    'text-blue-500 hover:text-blue-300' :
                    'text-blueGray-500 hover:text-blue-500'}
                `}                
                onClick={() => {router.push(route)}}
            >
                {icone}
                <div 
                    className={`
                        ml-2
                        ${rotaCalculada === route ? 
                            'border-l-2 pl-2 border-blue-500' :
                            ''}
                    `}
                    
                >
                    {title}
                </div>
            </div>
        )
    }

    return paginasPermitidas.indexOf(route) >= 0 ? 
        getJsxItem() : 
        null
}