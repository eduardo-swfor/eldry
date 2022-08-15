import Layout from '../../components/template/Layout'
import _ from 'lodash'
import { IconeEdit } from '../../components/icons'
import tiposOcorrencias from '../../data/tipos-ocorrencias.json'
import { useEffect, useState } from 'react'
import useAppData from '../../data/hook/useAppData'
import EscolherResponsavelItem from '../../components/telas/responsavel/EscolherResponsavelItem'
import BotaoOk from '../../components/botoes/BotaoOk'
import If from '../../components/utils/If'
import SelectInput from '../../components/inputs/SelectInput'
import endpoints from '../../data/endpoints.json'

export default function AtribuirResponsavel() {
    const { listarColecao, axiosPost, excluirObj, exibirToast } = useAppData()
    const [grupoSelecionado, setGrupoSelecionado] = useState({})
    const [grupos, setGrupos] = useState([])
    const [responsaveisGravados, setResponsaveisGravados] = useState([])
    const [itemSelecionado, setItemSelecionado] = useState(null)

    useEffect(() => {
        listarColecao(endpoints.GRUPO_EMPRESA).then(retorno => {
            setGrupos(retorno)
        })
        listarColecao(endpoints.RESPONSAVEL).then(retorno => {
            setResponsaveisGravados(retorno)
        })


        return () => {
            setGrupos(null)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    const jsxBotoes = p => {
        return (
            <div>
                <BotaoOk 
                    invertido
                    slim
                    label='Selecionar'
                    onClick={() => {
                        setGrupoSelecionado(p)
                        setMostrarResponsaveis(true)
                    }}
                />
            </div>
        )
    }

    async function excluir(item) {
        excluirObj(endpoints.RESPONSAVEL, item._id)
        setResponsaveisGravados(responsaveisGravados.filter(i => i !== item))
    }

    async function incluir(grupoEmpresa, tipoOcorrencia, usuarioSelecionado) {
        const obj = { grupoEmpresa: grupoEmpresa.nome, tipoOcorrencia, email: usuarioSelecionado }
        const retorno = await axiosPost(endpoints.RESPONSAVEL, obj)
        exibirToast('Responsáve adicionado')
        
        setResponsaveisGravados([...responsaveisGravados, retorno])
    }

    return (
        <Layout titulo='Atribuição de responsáveis' icone={IconeEdit()}>
            <div className='flex flex-col md:flex-row w-full mb-2'>
                <SelectInput 
                    label='Filtrar grupo de empresas'
                    className='w-full md:w-1/2 '
                    campoLabel='nome'
                    dados={grupos}
                    textoItem={grupoSelecionado ? grupoSelecionado.nome : ''}
                    onItemSelecionado={valor => {
                        if (valor){
                            setGrupoSelecionado(valor)
                        } else {
                            setGrupoSelecionado(null)
                        }
                    }} 
                />
                <SelectInput 
                    label='Filtrar responsáveis'
                    className='w-full md:ml-2 md:w-1/2'
                    campoLabel='novaDescricao'
                    dados={tiposOcorrencias.map(i => {
                        i['novaDescricao'] = `${i.codigo} - ${i.descricao}`
                        return i
                    })}
                    textoItem={itemSelecionado ? itemSelecionado.novaDescricao : ''}
                    onItemSelecionado={valor => {
                        if (valor){
                            setItemSelecionado(valor)
                        } else {
                            setItemSelecionado(null)
                        }
                    }} 
                />
            </div>
            <If exibir={grupoSelecionado != null && grupoSelecionado.nome}>
                {
                    tiposOcorrencias.filter(i => !itemSelecionado ? true : itemSelecionado.codigo == i.codigo).map((item, indice) => {
                        return (
                            <div 
                                className={`
                                    grid grid-cols-1 md:grid-cols-2 rounded 
                                    shadow-md border mb-4 p-2
                                    ${indice % 2 == 0 ? 'bg-gray-100' : ''}
                                `}
                                key={indice}
                            >
                                <EscolherResponsavelItem 
                                    className='md:col-span-1 w-full'
                                    grupoEmpresa={grupoSelecionado}
                                    tipoOcorrencia={item.codigo} 
                                    descricao={item.descricao} 
                                    responsaveisGravados={responsaveisGravados.filter(f => {
                                        return f.grupoEmpresa === grupoSelecionado.nome &&
                                            item.codigo === f.tipoOcorrencia
                                    })}
                                    incluir={incluir}
                                    excluir={excluir}
                                />

                                {
                                    item.itens.map((subitem, indiceSub) => {
                                        return (
                                            <EscolherResponsavelItem 
                                                className='col-span-1 w-full'
                                                grupoEmpresa={grupoSelecionado}
                                                key={indiceSub} 
                                                tipoOcorrencia={subitem.codigo} 
                                                descricao={subitem.descricao} 
                                                responsaveisGravados={responsaveisGravados.filter(f => {
                                                    return f.grupoEmpresa === grupoSelecionado.nome &&
                                                    subitem.codigo === f.tipoOcorrencia
                                                })}
                                                incluir={incluir}
                                                excluir={excluir}
                                            />
                                        )
                                    })
                                }
                            </div>
                        )
                    })
                }
            </If>
        </Layout>
    )
}