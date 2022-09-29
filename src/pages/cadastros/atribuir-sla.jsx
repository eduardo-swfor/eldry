import Layout from '../../components/template/Layout'
import _ from 'lodash'
import Subtitulo from '../../components/labels/Subtitulo'
import IntegerInput from '../../components/inputs/IntegerInput'
import TextInput from '../../components/inputs/TextInput'
import BotaoGravar from '../../components/botoes/BotaoGravar'
import { IconeRelogio } from '../../components/icons'
import tipos from '../../data/tipos-ocorrencias.json'
import { useEffect, useState } from 'react'
import useAppData from '../../data/hook/useAppData'
import endpoints from '../../data/endpoints.json'

export default function AtribuirSla() {
    const { gravarObj, listarColecao, exibirToast } = useAppData()
    const [estado, setEstado] = useState([])    

    useEffect(() => {
        listarColecao(endpoints.SLA).then(lista => {
            const novoEstado = _.cloneDeep(tipos)
            
            lista.forEach(vo => {
                const itemEstado = buscaCodigo(vo.codigo, novoEstado)
                
                if (itemEstado) {
                    itemEstado._id = vo._id
                    itemEstado.sla = vo.sla
                    itemEstado.textoObservacao = vo.textoObservacao
                }
            })
            
            setEstado(novoEstado)
        })

        return () => {
            setEstado([])
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function buscaCodigo(codigo, lista) {        
        for (const indice in lista) {
            const item = lista[indice]

            if (item.codigo === codigo) {
                return item
            } else if (item.itens) {
                const retorno = buscaCodigo(codigo, item.itens)

                if (retorno) {
                    return retorno
                }
            }
        }

        return null
    }

    async function gravaVo() {
        gravarObj(endpoints.SLA, estado).then(retorno =>{
            exibirToast('Registro gravado', 'sucesso')
        })
    }

    function renderizaItem(item, indice) {        
        return (
            <div key={indice} className='pl-4 pt-2 flex flex-col w-full'>
                <div className={`
                    flex flex-col
                `}>
                    <div className={`
                            text-sm 
                            ${!item.itens ? 'font-bold' : ''}
                    `}>
                        {`${item.codigo} - ${item.descricao}`}
                    </div>
                    {
                        item.itens ? 
                            null : 
                            <div className={`
                                    flex flex-col md:flex-row
                                    items-start
                            `}>
                                <IntegerInput 
                                    label='SLA'
                                    className='w-full md:w-1/6'
                                    placeholder='Digite o SLA' 
                                    value={item?.sla}
                                    onChange={valor => {                               
                                        item.sla = valor
                                    }}
                                />
                                <TextInput 
                                    label='Texto observação'
                                    className='md:pl-2 mr-4 w-full' 
                                    placeholder='Texto observação' 
                                    value={item.textoObservacao ? item.textoObservacao : ''}
                                    onChange={valor => {                                        
                                        item.textoObservacao = valor
                                    }}
                                />
                            </div>
                    }
                </div>
                {
                    !item.itens ? 
                        null : 
                        item.itens.map((sub, indice) => renderizaItem(sub, indice))
                }
            </div>
        )
    }

    function renderizaItens(valores) {        
        return valores.map((item, indice) => {
            return (
                <div key={indice} className='flex'>
                    {renderizaItem(item)}
                </div>
            )
        })
    }
    
    return (
        <Layout titulo='Atribuição de SLA' icone={IconeRelogio()}>
            <div className='flex w-full content-end pt-2 border-b pb-4'>
                <Subtitulo className='flex-grow'>Informe o SLA de cada tipo de ocorrência, em seguida clique no botão gravar</Subtitulo>
                <BotaoGravar onClick={() =>{
                    gravaVo()
                }} />
            </div>
                
            <div className='flex flex-col w-full pt-4 pl-4'>
                {renderizaItens(estado)}
            </div>        

        </Layout>
    )
}