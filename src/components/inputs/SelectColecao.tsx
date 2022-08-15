import { useEffect, useState } from 'react'
import useAppData from '../../data/hook/useAppData'
import CaptionCampo from '../labels/CaptionCampo'
import _ from 'lodash'

export interface SelectColecaoProps {
    endpoint?: string
    readOnly?: boolean
    required?: boolean
    label?: string
    camposExibicao?: CampoExibicao[]
    className?: string
    separador?: string
    onChange?: (valor: any) => void
    value?: ItemSelect | string
    itens?: ItemSelect[] | string[]
    slim?: boolean
    campoSort?: string
    retirarCampos?: boolean
    filtrarItens?: (valor: any) => boolean
    retornarCampo?: string
    filtroEndpoint?: Object
}

export interface CampoExibicao {
    nome: string
    funcaoFormatacao?: (valor: any) => string
}

export type ItemSelect = Record<string, any>

export interface MapaSelect {
    chave: string
    item: ItemSelect
}

type TipoDados = MapaSelect | string

export default function SelectColecao(props: SelectColecaoProps) {

    const [dados, setDados] = useState([] as TipoDados[])
    const { axiosGet } = useAppData()
    const [valorSelect, setValorSelect] = useState('')

    useEffect(() => {
        if (props.endpoint) {            
            axiosGet(props.endpoint, props.filtroEndpoint || {}).then(retorno => {
                const tratado = _.sortBy(retorno.map(r => {
                    let temp = {} as ItemSelect
                    if (props.retirarCampos) {
                        props.camposExibicao.map(campo => temp[campo.nome] = r[campo.nome])
                        temp._id = r._id
                    } else {
                        temp = r
                    }

                    return {
                        chave: getLabelItem(r),
                        item: temp
                    }
                }), [item => props.campoSort ? item[props.campoSort] : item.chave])

                const final = [{chave: '', item: null}, ...tratado]
                
                if (props.filtrarItens) {
                    setDados(final.filter(i => props.filtrarItens(i.item) || i.chave === '') )
                } else {
                    setDados(final)
                }
            })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.endpoint])

    useEffect(() => {
        if (props.itens?.length) {            
            if (props.camposExibicao?.length) {
                const tratado = _.sortBy(props.itens.map(r => {
                    let temp = {} as ItemSelect
                    if (props.retirarCampos) {
                        props.camposExibicao.map(campo => temp[campo.nome] = r[campo.nome])
                        temp._id = r._id
                    } else {
                        temp = r
                    }
    
                    return {
                        chave: getLabelItem(r),
                        item: temp
                    }
                }), [item => props.campoSort ? item[props.campoSort] : item.chave])
    
                const final = [{chave: '', item: null}, ...tratado]
    
                if (props.filtrarItens) {
                    setDados(final.filter(i => props.filtrarItens(i.item) || i.chave === ''))
                } else {
                    setDados(final)
                }
            } else {
                const tratado = props.itens as string[]
                const final = ['', ...tratado]
    
                if (props.filtrarItens) {
                    setDados(final.filter(i => props.filtrarItens(i) || i === ''))
                } else {
                    setDados(final)
                }
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.itens])

    useEffect(() => {
        if (!props?.value) {
            setValorSelect('')
        } else {
            const encontrado = dados.find(d => d === props.value)
    
            if (encontrado) {
                setValorSelect(encontrado.toString())
            } else {
                if (temCamposExibicao(props.value)) {
                    setValorSelect(getLabelItem(props.value))
                } else if (props.retornarCampo) {
                    const encontradoRetornar = dados.find(d => {
                        if (typeof d === 'string') {
                            return d == props.value
                        } else {
                            return d.item && d.item[props.retornarCampo] == props.value
                        }

                    })

                    if (!encontradoRetornar || encontradoRetornar === undefined) {
                        setValorSelect('')
                    } if (typeof encontradoRetornar !== 'string') {
                        setValorSelect(getLabelItem(encontradoRetornar?.item))
                    } else {
                        setValorSelect(encontradoRetornar)
                    }
                } else {
                    setValorSelect('')
                }
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.value, dados])

    const temCamposExibicao = item => {
        if (!item) {
            return false
        }

        return props?.camposExibicao?.map(c => item[c.nome]).reduce((a, n) => {
            if (!n) {
                return false
            }

            return true
        }, true)

    }

    const getLabelItem = item => {
        if (!item) {
            return ''
        }

        const valores = props.camposExibicao.map(c => c.funcaoFormatacao ? c.funcaoFormatacao(item[c.nome]) : item[c.nome])
        return valores.join(props.separador || ' - ').trim().replace(/ +/g, ' ')
    }

    return (
        <div 
            className={`
                ${props.className}
            `}
        >
            {!props.label ? null : <CaptionCampo>{(props.required ? '*' : '') + props.label}</CaptionCampo>}

            <select
                className={`
                    p-1 placeholder-gray-400 text-gray-600
                    ${props.readOnly ? 'bg-gray-50' : 'bg-white'} 
                    rounded text-sm border focus:outline-none focus:ring 
                    uppercase w-full
                `}

                value={valorSelect}
                
                onChange={value => {
                    if (props.readOnly) {
                        value.stopPropagation()
                        return
                    }

                    if (props.onChange) {
                        const valorSelecionado = dados.find(d => {
                            if (typeof d == 'string') {
                                return d === value.target.value
                            } else {
                                return d.chave === value.target.value
                            }
                        })

                        if (typeof valorSelecionado == 'string') { 
                            props.onChange(valorSelecionado)
                        } else {
                            if (props.retornarCampo) {
                                if (valorSelecionado.item) {
                                    props.onChange(valorSelecionado.item[props.retornarCampo])
                                } else {
                                    props.onChange('')
                                }
                            } else {
                                props.onChange(valorSelecionado.item)
                            }
                        }
                    }
                    setValorSelect(value.target.value)
                }}
            >
                {                    
                    dados?.map((item, indice) => {
                        if (typeof item == 'string') {
                            return <option key={indice} >{item}</option>
                        } else{
                            return <option key={indice} >{item.chave}</option>
                        }
                    }) 
                        
                }
            </select>
        </div>
    )

}