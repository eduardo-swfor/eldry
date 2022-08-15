import TabelaDados from '../../tabelas/TabelaDados'
import BotaoExcluirTabela from '../../botoes/BotaoExcluirTabela'
import Subtitulo from '../../labels/Subtitulo'
import BotaoGravar from '../../botoes/BotaoGravar'
import { useEffect, useState } from 'react'
import TextInput from '../../inputs/TextInput'
import useAppData from '../../../data/hook/useAppData'
import { validaEmail } from '../../../utils/email-utils'

export default function EscolherResponsavelItem({ grupoEmpresa, tipoOcorrencia, descricao, 
    responsaveisGravados, incluir, excluir, className='' }) {

    const [responsaveis, setResponsaveis] = useState(responsaveisGravados)
    const [usuarioSelecionado, setUsuarioSelecionado] = useState('')    
    const { pergunta, alerta } = useAppData()

    useEffect(() => {
        setResponsaveis(responsaveisGravados)
    }, [responsaveisGravados])

    const jsxBotoes = p => {
        return (
            <div>
                <BotaoExcluirTabela onClick={() => {
                    pergunta('Confirma a exclusão do responsável?', ()=> {
                        excluir(p)
                    })
                }}/>
            </div>
        )
    }    

    return (
        <div className={`
            px-2 
            ${className}
        `}>
            <div className='flex flex-col w-full'>
                <Subtitulo className='flex-grow'>{`${tipoOcorrencia} - ${descricao}`}</Subtitulo>
                <div className='flex items-center'>
                    <TextInput 
                        className='flex-grow' 
                        value={usuarioSelecionado}
                        onChange={valor => {
                            setUsuarioSelecionado(valor)
                        }}
                    />

                    <BotaoGravar 
                        className='ml-2' 
                        onClick={async () => {
                            if (!validaEmail(usuarioSelecionado)) {
                                alerta('Informe um e-mail válido')
                                return
                            }

                            await incluir(grupoEmpresa, tipoOcorrencia, usuarioSelecionado)
                            setUsuarioSelecionado('')
                        }} 
                    />
                </div>
            </div>

            <TabelaDados 
                className='w-full'
                propriedades={[
                  {nome: 'email', tipo: 'string', titulo: 'E-mail' },
                  {nome: 'acoes', tipo: 'jsx', titulo: 'Ações', jsx: jsxBotoes }
                ]} 
                titulo='Responsáveis'
                dados={responsaveis}
            />
        </div>
    )

}