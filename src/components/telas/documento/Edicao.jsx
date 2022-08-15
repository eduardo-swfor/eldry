import TextInput from '../../inputs/TextInput'
import Subtitulo from '../../labels/Subtitulo'
import BotaoGravar from '../../botoes/BotaoGravar'
import BotaoVoltar from '../../botoes/BotaoVoltar'
import BotaoLimparTabela from '../../botoes/BotaoLimparTabela'
import _ from 'lodash'
import { useRef, useState } from 'react'
import useAppData from '../../../data/hook/useAppData'
import If from '../../utils/If'


export default function EdicaoDocumento({objEditado, voltar, gravar}) {
    
    const [vo, setVo] = useState(objEditado)
    const { erro, alerta } = useAppData()
    const inputArquivo = useRef(null)    

    function validaDados() {
        const erros = []

        if (!vo.descricao || !vo.arquivo) {
            erros.push('Todos os campos são obrigatórios')
        }

        if (erros.length > 0) {
            erro(erros.join('\n'))
            return false
        }

        return true
    }

    return (
        <div className='px-2'>
            <div className='flex flex-wrap w-full h-full'>
                <div className='flex flex-row w-full justify-between'>
                    <Subtitulo>Alteração/Inclusão de documentos</Subtitulo>
                    <div className='flex'>
                        <BotaoVoltar 
                            className='mr-3'
                            onClick={voltar}
                        />
                        <BotaoGravar 
                            onClick={() => {
                                if (validaDados()) {
                                    gravar(vo)
                                }
                            }} />
                    </div>
                </div>
                
                <div className='flex flex-col w-full md:flex-row'>
                    <TextInput 
                        required
                        label='Descrição' 
                        placeholder='Descrição da mensagem' 
                        className='w-full' 
                        value={vo.descricao}
                        onChange={valor => { 
                            setVo({...vo, descricao: valor})
                        }}
                    />                    
                </div>                
                <input 
                    type="file" 
                    ref={inputArquivo}
                    onChange={event=>{ 
                        const file = event.target.files[0]

                        if (file?.size > 10e6) {
                            inputArquivo.current.value = ''
                            setVo({...vo, arquivo: null})
                            
                            alerta('O arquivo não pode ter mais que 10MB')
                        } else {
                            setVo({...vo, arquivo: event.target.files[0]})
                        }

                    }}
                />
                <If exibir={vo.arquivo}>
                    <BotaoLimparTabela 
                        className='m2-2' 
                        onClick={() => {
                            inputArquivo.current.value = ''
                            setVo({...vo, arquivo: null})
                        }}
                    />
                </If>            
            </div>
        </div>
      )
}