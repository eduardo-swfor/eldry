import Sidebar from '../Sidebar/Sidebar'
import NavBar from '../Sidebar/NavBar'
import { useEffect, useState } from 'react'
import ForcarAutenticacao from '../auth/ForcarAutenticacao'
import Titulo from '../labels/Titulo'
import useAppData from '../../data/hook/useAppData'
import { useRouter } from 'next/router'
import endpoints from '../../data/endpoints.json'

interface LayoutProps {
    titulo?: string
    icone?: any
    children?: any
}

export default function Layout(props: LayoutProps) {    
    const [forcarVisivel, setForcarVisivel] = useState(false)
    const [semPermissao, setSemPermissao] = useState(false)
    const{ axiosGet } = useAppData()
    const router = useRouter()
    const [rotaCalculada, setRotaCalculada] = useState('')

    useEffect(()=>{
        let rota = router.pathname
        
        if (rota.indexOf('[') >= 0) {
            rota = rota.substring(0, rota.indexOf('['))
            const parametro = Object.keys(router.query).pop()
            rota = `${rota}${router.query[parametro]}`
        } 
        setRotaCalculada(rota)
        
        axiosGet(endpoints.VERIFICA_PERMISSAO, {pagina: rota}).then(permissao => {
            //mudou
            if (!permissao) {
                setSemPermissao(true)
            } else {
                setSemPermissao(false)
            }
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query])

    const getJsxAuth = () => {
        return (
            <ForcarAutenticacao>         
                <Sidebar forcarVisivel={forcarVisivel} />
                <NavBar clickMenu={()=>{setForcarVisivel(!forcarVisivel)}} />

                <div className={`
                    ml-2 md:ml-72 overflow-y-auto h-full overflow-x-hidden
                    -mt-20 bg-white mr-2 md:mr-8 rounded border
                    shadow-md mb-10
                `}>
                    <div className='bg-gray-100 rounded'>
                        <div className={`
                            relative flex flex-row py-1 text-gray-900 font-extrabold
                            border-b shadow-sm items-center pl-2
                        `}
                        >
                            {!props.icone ? null : <div className='mr-2'> {props.icone} </div>}
                            <Titulo>{props.titulo}</Titulo>
                        </div>
                    </div>
                    <div className='p-2 overflow-x-auto'>
                        {props.children}
                    </div>
                </div>
            </ForcarAutenticacao>
        )
    }

    const getJsxSemPermissao = () => {
        return (
            <div className='w-screen h-screen flex items-center justify-center'>
                <Titulo className='text-red-500'>VOCÊ NÃO TEM PERMISSÃO PARA ACESSAR ESTA PÁGINA: {rotaCalculada ? rotaCalculada : router.pathname}</Titulo>
            </div>
        )
    }

    return (   
        <>
            {!semPermissao ? getJsxAuth() : getJsxSemPermissao()}
        </>
    )
}