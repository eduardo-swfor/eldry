import logo from '../../../public/images/logo.png'
import Image from 'next/image'
import PasswordInput from '../../components/inputs/PasswordInput'
import BotaoEntrar from '../../components/botoes/BotaoEntrar'
import TextInput from '../../components/inputs/TextInput'
import { IconeCadeado, IconeUsuario, IconeSoma, IconeCarta } from '../../components/icons'
import Subtitulo from '../../components/labels/Subtitulo'
import { useState } from 'react'
import useAuth from '../../data/hook/useAuth'
import Spinner from '../utils/SpinnerCentro'

export default function FormLogin({novoUsuario, esqueceuSenha}) {
    const { login } = useAuth()
    const [estado, setEstado] = useState({})
    const [erro, setErro] = useState('')
    const [loading, setLoading] = useState(false)

    return (
        <>
            {loading ? <Spinner /> : null}
            <div className={`
                flex flex-col w-screen h-screen 
                items-center justify-center relative
            `}>                
                <div className={`
                    w-full h-full flex flex-col self-center
                    md:border md:h-auto md:w-2/5 md:rounded-md
                    bg-white content-center items-center
                    p-4 shadow-md
                `}>
                    <div className='w-44 md:mb-2'>
                      <Image src={logo} alt='Logo'></Image>
                    </div>

                    <div className='flex w-full items-center border-b pb-1'>
                        {IconeCadeado()}
                        <Subtitulo className='ml-2 mt-2'>Login portal AFC</Subtitulo>
                    </div>

                    {
                        !erro ? 
                            null :
                            <div className='flex flex-wrap text-red-500 font-bold mt-2 text-sm'>
                                {erro}
                            </div>
                    }

                    <TextInput 
                        label='E-mail'
                        className='w-full'
                        value={estado.email}
                        onChange={valor => {
                            setEstado({...estado, email: valor})
                        }}
                    />
                    <PasswordInput 
                        label='Senha'
                        className='w-full'
                        value={estado.senha}
                        onChange={valor => {
                            setEstado({...estado, senha: valor})
                        }}
                    />

                    <div className='flex w-full pt-2 items-end justify-between'>
                        <div 
                            className={`
                                flex flex-wrap text-sm items-center 
                                cursor-pointer mt-2 p-2 rounded-md
                            `}
                            onClick={esqueceuSenha}
                        >
                            <div className='mr-2'>{IconeCarta(5)}</div>
                            Esqueceu sua senha?
                        </div>
                        <BotaoEntrar 
                            onClick={async () => {
                                try {
                                    setLoading(true)
                                    await login(estado.email, estado.senha)
                                } catch (error) {
                                    setErro(error)
                                    setEstado({})
                                } finally {
                                    setLoading(false)
                                }
                            }}
                        />
                    </div>

                    <div className={`
                        border-t w-full mt-2
                    `}/>
                    <div 
                        className={`
                            flex flex-wrap text-sm items-center
                            cursor-pointer font-bold mt-2 text-blue-500 p-2 rounded-md
                        `}
                        onClick={novoUsuario}
                    >
                        <div>{IconeUsuario(5)}</div>
                        <div className='relative -ml-1 mr-2'>{IconeSoma(3)}</div>
                        Crie sua conta aqui
                    </div>
                </div>
            </div>
        </>
    )
}