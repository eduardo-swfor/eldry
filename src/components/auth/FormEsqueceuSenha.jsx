import logo from '../../../public/images/logo.png'
import Image from 'next/image'
import BotaoEnviarEmail from '../../components/botoes/BotaoEnviarEmail'
import BotaoVoltar from '../../components/botoes/BotaoVoltar'
import BotaoOk from '../../components/botoes/BotaoOk'
import TextInput from '../../components/inputs/TextInput'
import { IconeChave } from '../../components/icons'
import Subtitulo from '../../components/labels/Subtitulo'
import { validaEmail } from '../../utils/email-utils'
import { useState } from 'react'
import useAppData from '../../data/hook/useAppData'
import endpoints from '../../data/endpoints.json'
import If from '../../components/utils/If'
import axios from 'axios'

export default function FormEsqueceuSenha({voltar}) {

    const [erro, setErro] = useState('')
    const [estado, setEstado] = useState({})
    const AppData = useAppData()
    const [exibirCodigo, setExibirCodigo] = useState(false)
    const [codigo, setCodigo] = useState(false)

    const enviaEmail = async () => {
        if (!estado.email || !estado.confirmacao) {
            setErro('* É necessário informar o e-mail e confirmar no campo logo abaixo')
        } else if (estado.email !== estado.confirmacao) {
            setErro('* A confirmação está diferente do e-mail original')
        } else if (!validaEmail(estado.email) || !validaEmail(estado.confirmacao)) {
            setErro('* É necessário informar um e-mail válido')
        } else {
            await axios.post(endpoints.USUARIO, { reiniciarSenha:true, email: estado.email })
            setCodigo('')
            AppData.exibirModal('Senha', 'Verifique seu e-mail e digite o código recebido no campo situado na parte inferior da tela!')
            setExibirCodigo(true)
        }
    }

    const reiniciaSenha = async () => {
        if (!codigo) {
            setErro('Informe o código recebido por e-mail corretamente')
        } else {
            const retorno = await axios.post(endpoints.USUARIO, { tokenInformado: codigo })
            const dados = retorno.data
                
            if (dados.startsWith('$')) {
                AppData.erro(dados.substring(1))
            } else {
                AppData.exibirModal('Senha', 'Foi enviado um e-mail com as informações de login!')
                voltar()
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
                        {IconeChave()}
                        <Subtitulo className='ml-2 mt-2'>Recuperação de senha</Subtitulo>
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
                        *ao clicar no botão "Enviar", você receberá uma mensagem no e-mail 
                        informado com uma chave para a recuperação da sua senha
                        `}
                    </div>
                    
                    <If exibir={exibirCodigo}>
                        <div className={`
                            flex w-full pt-2 justify-between items-center
                        `}>
                            <TextInput 
                                required
                                label='Confirme o código recebido por e-mail'
                                className='w-full'
                                value={codigo}
                                onChange={valor => {
                                    setCodigo(valor)
                                }}
                            />
                            <BotaoOk 
                                className='mt-4 ml-2'
                                onClick={reiniciaSenha}
                            />
                        </div>
                    </If>
                    
                </div>
            </div>
        </>
    )
}