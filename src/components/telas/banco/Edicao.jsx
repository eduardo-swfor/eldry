import TextInput from '../../inputs/TextInput'
import Subtitulo from '../../labels/Subtitulo'
import BotaoGravar from '../../botoes/BotaoGravar'
import BotaoVoltar from '../../botoes/BotaoVoltar'
import _ from 'lodash'
import { useState } from 'react'
import useAppData from '../../../data/hook/useAppData'
import CheckboxInput from '../../inputs/CheckboxInput'

export default function EdicaoBanco({objEditado, voltar, gravar}) {
    
    const [vo, setVo] = useState(objEditado)
    const { erro } = useAppData()

    function validaDados() {
        const erros = []

        if (!vo.nome ) {
            erros.push('O campo código e nome devem ser preenchidos')
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
                    <Subtitulo>Alteração/Inclusão de bancos</Subtitulo>
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
                        label='Código' 
                        placeholder='Código do banco' 
                        className='w-full md:w-1/5' 
                        value={vo.codigo}
                        onChange={valor => { 
                            setVo({...vo, codigo: valor})
                        }}
                    />
                    <TextInput 
                        required
                        label='Nome' 
                        placeholder='Nome do banco' 
                        className='w-full md:w-4/5 md:ml-2'
                        value={vo.nome}
                        onChange={valor => { 
                            setVo({...vo, nome: valor})
                        }}
                    /> 
                </div>
                <CheckboxInput 
                    label='Pagamento?'
                    value={vo.pagamento === null ? false : vo.pagamento}
                    onChange={valor => { 
                        setVo({...vo, pagamento: valor})
                    }}
                />
            </div>
        </div>
      )
}