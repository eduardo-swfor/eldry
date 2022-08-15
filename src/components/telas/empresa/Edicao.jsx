import TextInput from '../../inputs/TextInput'
import SelectInput from '../../inputs/SelectInput'
import Subtitulo from '../../labels/Subtitulo'
import BotaoGravar from '../../botoes/BotaoGravar'
import BotaoVoltar from '../../botoes/BotaoVoltar'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import useAppData from '../../../data/hook/useAppData'
import endpoints from '../../../data/endpoints.json'

export default function Edicao({objEditado, voltar, gravar}) {
    
    const [vo, setVo] = useState(objEditado)
    const { axiosGet } = useAppData();
    const { erro } = useAppData()
    const [grupos, setGrupos] = useState([])

    useEffect(() => {
        axiosGet(endpoints.GRUPO_EMPRESA).then(p => {
          if (p != null) {
            //mudou
            setGrupos(p)
          }
        })
    
        return () => {
          setGrupos([])
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

    function validaDados() {
        const erros = []

        if (!vo.nome ) {
            erros.push('O campo código, nome e grupo devem ser preenchidos')
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
                    <Subtitulo>Alteração/Inclusão de empresas</Subtitulo>
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
                
                <div className='flex flex-col w-full'>
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

                    <SelectInput 
                        required
                        label='Grupo empresa' 
                        dados={grupos} 
                        className='w-full md:w-1/2'
                        campoLabel='nome'
                        textoItem={vo.grupoEmpresa?.nome}
                        onItemSelecionado={valor => {
                        if (valor){
                            setVo({...vo, grupoEmpresa: valor})
                        } else {
                            setVo({...vo, grupoEmpresa: {nome: ''}})
                        }
                        }}            
                    />
                </div>
            </div>
        </div>
      )
}