import TextInput from '../inputs/TextInput'
import { IconeX } from '../icons'
import _ from 'lodash'
import Subtitulo from '../labels/Subtitulo'
import { Tipo, Filtro } from './TabelaDados'
import DoubleInput from '../inputs/DoubleInput'
import IntegerInput from '../inputs/IntegerInput'
import SelectColecao from '../inputs/SelectColecao'
import { useState, useEffect } from 'react'
import BotaoLimparTabela from '../botoes/BotaoLimparTabela'
import { formataNumeroMilhar } from '../../utils/NumeroUtils'
import { formataValorParaExcel } from './TabelaDados'

interface PropsFormDocumento {
    className?: string
    tipos: Tipo[]
    fechar?: () => void
    aplicaFiltros: (param: Filtro[]) => void
}

export default function FormFiltroTabela(props: PropsFormDocumento) {
    const [filtros, setFiltros] = useState([] as Filtro[])

    useEffect(() => {
        props?.aplicaFiltros(filtros)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filtros])

    const getComponenteFiltro = (prop: Tipo) => {
        const pesquisaValor = () => filtros?.find(i => i.nomeCampo === prop.nome)?.valor || ''

        if (prop.tipo.toLowerCase() === 'boolean') {
            return (
                <SelectColecao 
                    label={prop.titulo}
                    itens={['SIM', 'NÃO']}
                    value={pesquisaValor()}
                    onChange={valor => {
                        if (valor) {
                            setFiltros([
                                ...filtros.filter(f => f.nomeCampo !== prop.nome), 
                                {
                                    nomeCampo: prop.nome,
                                    valor,
                                    aplicaFiltro: item => {
                                        let valorItem = formataValorParaExcel(prop.tipo, item, prop.nome)
                                        return valor.toUpperCase() === valorItem.toUpperCase()
                                    }
                                }
                            ])
                        } else {
                            setFiltros(filtros.filter(f => f.nomeCampo !== prop.nome))
                        }
                    }}
                />
            )
        } else if (prop.tipo.toLowerCase() === 'string') {
            return (
                <TextInput
                    label={prop.titulo}
                    value={pesquisaValor()}
                    onChange={valor => {
                        if (valor) {
                            setFiltros([
                                ...filtros.filter(f => f.nomeCampo !== prop.nome), 
                                {
                                    nomeCampo: prop.nome,
                                    valor,
                                    aplicaFiltro: item => {
                                        let valorItem = formataValorParaExcel(prop.tipo, item, prop.nome)

                                        return valorItem && `${valorItem}`.toUpperCase().indexOf(valor) >= 0
                                    }
                                }
                            ])
                        } else {
                            setFiltros(filtros.filter(f => f.nomeCampo !== prop.nome))
                        }
                    }}
                />
            )
        } else if (prop.tipo.toLowerCase() === 'date' || prop.tipo.toLowerCase() === 'datetime') {
            return (
                <TextInput
                    label={prop.titulo}
                    value={pesquisaValor()}
                    onChange={valor => {
                        if (valor) {
                            setFiltros([
                                ...filtros.filter(f => f.nomeCampo !== prop.nome), 
                                {
                                    nomeCampo: prop.nome,
                                    valor,
                                    aplicaFiltro: item => {
                                        let valorItem = formataValorParaExcel(prop.tipo, item, prop.nome)

                                        if (valorItem === undefined || valorItem === null) {
                                            return false
                                        }

                                        return `${valorItem}`.indexOf(valor) >= 0
                                    }
                                }
                            ])
                        } else {
                            setFiltros(filtros.filter(f => f.nomeCampo !== prop.nome))
                        }
                    }}
                />
            )
        } else if (prop.tipo.toLowerCase() === 'double') {
            return (
                <DoubleInput
                    label={prop.titulo}
                    value={pesquisaValor()}
                    onChange={valor => {
                        if (valor) {
                            setFiltros([
                                ...filtros.filter(f => f.nomeCampo !== prop.nome), 
                                {
                                    nomeCampo: prop.nome,
                                    valor,
                                    aplicaFiltro: item => {
                                        let valorItem = formataValorParaExcel(prop.tipo, item, prop.nome)
                                        if (valorItem === undefined || valorItem === null) {
                                            return false
                                        }
                                        valorItem = formataNumeroMilhar(valorItem).replaceAll('.', '')

                                        return `${valorItem}`.indexOf(valor) >= 0
                                    }
                                }
                            ])
                        } else {
                            setFiltros(filtros.filter(f => f.nomeCampo !== prop.nome))
                        }
                    }}
                />
            )
        } else if (prop.tipo.toLowerCase() === 'integer') {
            return (
                <IntegerInput
                    label={prop.titulo}
                    value={pesquisaValor()}
                    onChange={valor => {
                        if (valor) {
                            setFiltros([
                                ...filtros.filter(f => f.nomeCampo !== prop.nome), 
                                {
                                    nomeCampo: prop.nome,
                                    valor,
                                    aplicaFiltro: item => {
                                        let valorItem = formataValorParaExcel(prop.tipo, item, prop.nome)

                                        if (valorItem === undefined || valorItem === null) {
                                            return false
                                        }

                                        return `${valorItem}`.indexOf(valor) >= 0
                                    }
                                }
                            ])
                        } else {
                            setFiltros(filtros.filter(f => f.nomeCampo !== prop.nome))
                        }
                    }}
                />
            )
        }
    }

    return (
        <div
            className={`
                w-full grid gap-2 items-end border mt-2        
        `}>
            <div className='bg-gray-200 pt-1 pl-2 flex flex-row justify-between'>
                <Subtitulo >{'Preencha qualquer campo abaixo para filtrar a tabela'}</Subtitulo>
                <div
                    onClick={() => {
                        setFiltros([])
                        props.aplicaFiltros([])
                        props?.fechar()
                    }}
                    className='cursor-pointer hover:text-white'
                >
                    {IconeX()}
                </div>
            </div>
            
            {
                filtros.length ? 
                    <div>
                        <BotaoLimparTabela 
                            className='bg-yellow-300 text-black ml-2'
                            onClick={() => {
                                setFiltros([])
                            }}
                        />
                    </div> : 
                    null
            }

            <div 
                className={`
                    w-full grid md:grid-cols-2 lg:grid-cols-4 px-2 pb-2 gap-x-2
                `}
            >
                {
                    props?.tipos?.filter(tipo => tipo.tipo !== 'jsx').map((tipo, indice) => {
                        return (
                            <div key={indice} className='w-full'>
                                {getComponenteFiltro(tipo)}
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )

}