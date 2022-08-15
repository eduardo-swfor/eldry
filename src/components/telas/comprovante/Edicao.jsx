import TextInput from '../../inputs/TextInput'
import DateInput from '../../inputs/DateInput'
import CampoPesquisaEmpresa from '../empresa/CampoPesquisaEmpresa'
import SelectTipoComprovante from '../tipo-comprovante/SelectTipoComprovante'
import Subtitulo from '../../labels/Subtitulo'
import BotaoGravar from '../../botoes/BotaoGravar'
import BotaoVoltar from '../../botoes/BotaoVoltar'
import BotaoLimparTabela from '../../botoes/BotaoLimparTabela'
import _ from 'lodash'
import { useRef, useState } from 'react'
import useAppData from '../../../data/hook/useAppData'
import If from '../../utils/If'
import SelectColecao from '../../inputs/SelectColecao'
import endpoints from '../../../data/endpoints.json'


export default function EdicaoComprovante({objEditado, voltar, gravar}) {
    const [vo, setVo] = useState(objEditado)
    const { erro } = useAppData()
    const inputArquivo = useRef(null)    

    function validaDados() {
        const erros = []

        if (!vo.tipo || !vo.banco || !vo.data || !vo.empresa || !vo.arquivo) {
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
                    <Subtitulo>Alteração/Inclusão de comprovantes</Subtitulo>
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

                <div className='grid grid-cols-1 md:grid-cols-3 gap-2 w-full'>                    

                    <SelectTipoComprovante 
                        className='w-full'
                        required
                        onChange={valor => {
                            setVo({...vo, tipo: valor})
                        }}
                        value={vo.tipo}
                    />
                    <DateInput 
                        label='Data'
                        required
                        className='w-full'
                        onChange={valor => {
                            setVo({...vo, data: valor})
                        }}
                        value={vo.data}
                    />

                    <SelectColecao
                        required
                        className='w-full'
                        label='Banco'
                        camposExibicao={[{nome: 'nome'}, {nome: 'codigo'}]}
                        endpoint={endpoints.BANCO}
                        value={vo.banco}
                        onChange={valor => setVo({...vo, banco: valor})}
                        retirarCampos
                        filtroEndpoint={{pagamento: true}}
                    />
                    
                    <CampoPesquisaEmpresa 
                        required
                        className='md:col-span-3' 
                        onChange={valor => {
                            setVo({...vo, empresa: valor})
                        }}
                        value={vo.empresa}
                    />
                    {
                        !vo._id ?
                            <div className='md:col-span-3'>
                                <input 
                                    type="file" 
                                    ref={inputArquivo}
                                    onChange={event=>{ 
                                        setVo({...vo, arquivo: event.target.files[0]})
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
                            </div> :
                            null
                    }
                    
                </div>
                
                           
            </div>
        </div>
      )
}