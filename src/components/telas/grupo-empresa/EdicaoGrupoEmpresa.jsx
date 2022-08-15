import TextInput from '../../inputs/TextInput'
import Subtitulo from '../../labels/Subtitulo'
import BotaoGravar from '../../botoes/BotaoGravar'
import BotaoVoltar from '../../botoes/BotaoVoltar'
import _ from 'lodash'
import { useState } from 'react'
import useAppData from '../../../data/hook/useAppData'

export default function EdicaoDominio({objEditado, voltar, gravar}) {
    
    const [vo, setVo] = useState(objEditado)
    const { erro } = useAppData()

    function validaDados() {
        const erros = []

        if (!vo.nome) {
            erros.push('O campo nome deve ser preenchido')
        }

        if (erros.length > 0) {
            erro(erros.join('\n'))
            return false
        }

        return true
    }

    return (
        <>
            <div className='flex flex-wrap w-full h-full px-2'>
                <div className='flex flex-row w-full justify-between'>
                    <Subtitulo>Alteração/Inclusão de grupos de empresas</Subtitulo>
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
                
                <TextInput 
                    required
                    label='Nome do grupo' 
                    placeholder='Digite aqui o nome do grupo' 
                    className='w-full' 
                    value={vo.nome}
                    onChange={valor => { 
                        setVo({...vo, nome: valor})
                     }}
                /> 
            </div>
        </>
      )
}