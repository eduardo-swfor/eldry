import TextInput from '../inputs/TextInput'
import PasswordInput from '../inputs/PasswordInput'
import Usuario from '../../model/Usuario'
import { useState } from 'react'
import BotaoGravar from '../botoes/BotaoGravar'
import Subtitulo from '../labels/Subtitulo'
import useAppData from '../../data/hook/useAppData'
import endpoints from '../../data/endpoints.json'

interface FormAlteraSenhaProps {
    className?: string    
    usuario?: Usuario    
}

interface InfoSenha {
    senhaAtual: string
    novaSenha: string
    confirmacaoSenha: string        
}

export default function FormAlteraSenha(props: FormAlteraSenhaProps) {
    const [infoSenha, setInfoSenha] = useState({} as InfoSenha)
    const { axiosPost, exibirToast } = useAppData()

    const camposPreenchidos = () => {
        return infoSenha.confirmacaoSenha && infoSenha.novaSenha && 
            infoSenha.senhaAtual
    }

    return (
        <div className={`${props.className} flex flex-col items-end`}>
            <Subtitulo>
                {'*A nova senha deve ter no mínimo 8 caracteres, pelo menos 1 caractere especial e 1 número'}
            </Subtitulo>

            <PasswordInput
                className='w-full'
                label='*Senha atual'
                value={infoSenha?.senhaAtual}
                onChange={valor => {
                    setInfoSenha({...infoSenha, senhaAtual: valor})
                }}
            />

            <PasswordInput
                className='w-full'
                label='*Nova senha'
                value={infoSenha?.novaSenha}
                onChange={valor => {
                    setInfoSenha({...infoSenha, novaSenha: valor})
                }}
            />        

            <PasswordInput
                className='w-full'
                label='*Confirmar nova senha'
                value={infoSenha?.confirmacaoSenha}
                onChange={valor => {
                    setInfoSenha({...infoSenha, confirmacaoSenha: valor})
                }}
            />      

            {
                infoSenha.confirmacaoSenha && infoSenha.novaSenha && infoSenha.confirmacaoSenha !== infoSenha.novaSenha ?
                    <Subtitulo className='text-red-500 w-full self-center'>
                        {`A nova senha e a confirmação devem ser iguais`}
                    </Subtitulo> : 
                    null
            }

            {
                camposPreenchidos() ?
                    <BotaoGravar 
                        onClick={async () => {
                            await axiosPost(endpoints.ALTERAR_SENHA, {
                                senhaAtual: infoSenha.senhaAtual,
                                novaSenha: infoSenha.novaSenha,
                                confirmacaoSenha: infoSenha.confirmacaoSenha,
                                email: props.usuario.email
                            })
                            exibirToast('Senha alterada com sucesso!', 's')
                            setInfoSenha({} as InfoSenha)                            
                        }}
                    /> :

                    <Subtitulo className='text-red-500 w-full'>
                        {`Preencha todos os campos`}
                    </Subtitulo>
            }
            
        </div>
    )
}