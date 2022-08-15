import TextInput from '../../inputs/TextInput'
import DateInput from '../../inputs/DateInput'
import Subtitulo from '../../labels/Subtitulo'
import BotaoGravar from '../../botoes/BotaoGravar'
import BotaoVoltar from '../../botoes/BotaoVoltar'
import _ from 'lodash'
import { useState } from 'react'
import useAppData from '../../../data/hook/useAppData'

export default function EdicaoBanco({objEditado, voltar, gravar}) {
    
    const [vo, setVo] = useState(objEditado)
    const { erro } = useAppData()

    function validaDados() {
        const erros = []

        if (!vo.descricao ) {
            erros.push('O campo descrição e datas devem ser preenchidos')
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
                    <Subtitulo>Alteração/Inclusão de feriados</Subtitulo>
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
                
                <div className='w-full grid grid-cols-4 gap-2'>
                    <DateInput 
                        required
                        label='Data' 
                        placeholder='Data do feriado' 
                        value={vo.data}
                        onChange={valor => { 
                            setVo({...vo, data: valor})
                        }}
                    />
                    <TextInput 
                        required
                        label='Descrição' 
                        placeholder='Descrição' 
                        className='md:col-span-3'
                        value={vo.descricao}
                        onChange={valor => { 
                            setVo({...vo, descricao: valor})
                        }}
                    /> 
                </div>
            </div>
        </div>
      )
}