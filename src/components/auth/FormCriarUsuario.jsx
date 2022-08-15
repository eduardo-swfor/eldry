import logo from '../../../public/images/logo.png'
import Image from 'next/image'
import BotaoEnviarEmail from '../../components/botoes/BotaoEnviarEmail'
import BotaoVoltar from '../../components/botoes/BotaoVoltar'
import TextInput from '../../components/inputs/TextInput'
import { IconeUsuario, IconeSoma } from '../../components/icons'
import Subtitulo from '../../components/labels/Subtitulo'
import { validaEmail } from '../../utils/email-utils'
import { useState } from 'react'
import useAppData from '../../data/hook/useAppData'
import endpoints from '../../data/endpoints.json'
import axios from 'axios'

export default function FormCriarUsuario({voltar}) {

    const [erro, setErro] = useState('')
    const [estado, setEstado] = useState({})
    const AppData = useAppData()    

    const enviaEmail = async () => {
        if (!estado.email || !estado.confirmacao) {
            setErro('* É necessário informar o e-mail e confirmar no campo logo abaixo')
        } else if (estado.email !== estado.confirmacao) {
            setErro('* A confirmação está diferente do e-mail original')
        } else if (!validaEmail(estado.email) || !validaEmail(estado.confirmacao)) {
            setErro('* É necessário informar um e-mail válido')
        } else {
            const response = await axios.get(endpoints.DOM_PERM)
            const filtrado = response.data.filter(item => estado.email.toUpperCase().endsWith(item.toUpperCase()))

            if (!filtrado || filtrado.length == 0) {
                setErro('O cadastro deste e-mail não é permitido no portal! Em caso de dúvidas entre em contato com a área de pagamentos')
            } else {
                const retorno = await axios.post(endpoints.USUARIO, { criarUsuario:true, email: estado.email })
                const dados = retorno.data
                
                if (dados.startsWith('$')) {
                    AppData.erro(dados.substring(1))
                } else {
                    AppData.exibirModal('Usuário', 'Foi enviado uma mensagem com o usuário e senha para o e-mail informado!')
                    voltar()
                }
            }
        }
    }    

    return (
        <>
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
                    <div className='w-44 bb-6 md:mb-2'>
                      <Image src={logo} alt='Logo'></Image>
                    </div>

                    <div className='flex w-full items-center border-b pb-1'>
                        {IconeUsuario()}
                        <div className='relative -ml-1 mr-2'>{IconeSoma(3)}</div>
                        <Subtitulo className='ml-2 mt-2'>Criar novo login para o portal</Subtitulo>
                    </div>

                    {
                        !erro ? 
                            null :
                            <div className='flex flex-wrap text-red-500 font-bold mt-2 text-sm'>
                                {erro}
                            </div>
                    }
                    

                    <TextInput 
                        required
                        label='E-mail'
                        className='w-full'
                        value={estado.email}
                        onChange={valor => {
                            setEstado({...estado, email:valor})
                        }}
                    />
                    <TextInput 
                        required
                        label='Confirme o e-mail digitado acima'
                        className='w-full'
                        value={estado.confirmacao}
                        onChange={valor => {
                            setEstado({...estado, confirmacao:valor})
                        }}
                    />

                    <div className='flex w-full pt-2 items-end justify-between'>        
                        <BotaoVoltar 
                            onClick={() => {
                                if (voltar) voltar()
                            }}
                        />         

                        <BotaoEnviarEmail 
                            onClick={enviaEmail}
                        />
                    </div>

                    <div className={`
                        flex flex-wrap text-xs items-center 
                        cursor-pointer mt-2 p-2 rounded-md
                    `}>
                        {`
                        *ao clicar no botão "Enviar", você receberá uma 
                        mensagem no e-mail informado com os dados de login
                        `}
                    </div>
                </div>
            </div>
        </>
    )
}