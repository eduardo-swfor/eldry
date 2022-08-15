import TextInput from '../inputs/TextInput'
import TextAreaInput from '../inputs/TextAreaInput'
import Subtitulo from '../labels/Subtitulo'
import BotaoGravar from '../botoes/BotaoGravar'
import BotaoVoltar from  '../botoes/BotaoVoltar'
import DoubleInput from '../inputs/DoubleInput'
import IntegerInput from '../inputs/IntegerInput'
import DateInput from '../inputs/DateInput'
import CheckboxInput from '../inputs/CheckboxInput'
import SelectComboColecao from '../inputs/SelectComboColecao'
import _ from 'lodash'
import { useEffect, useRef, useState } from 'react'
import useAppData from '../../data/hook/useAppData'

interface Tipo {
    nome: string
    titulo?: string
    tipo: string
    required?: boolean
    colunas: number
    endpointColecao?: string
    labelColecao?: string  
    gravarSomenteLabelColecao?: boolean
}

interface EdicaoProps {
    objEditado: any
    colunas: number
    voltar: () => void
    gravar: (vo: any) => void
    campos: Tipo[]
}

export default function Edicao(props: EdicaoProps) {
    
    const [vo, setVo] = useState(props.objEditado)
    const { alerta } = useAppData()

    function validaDados() {
        let erros = []

        props.campos.map(campo => {
            if (campo.required && !vo[campo.nome]) {
                erros = [...erros, campo.nome]
            }
        })

        if (erros.length > 0) {
            alerta(`Os campos a seguir são obrigatórios: ${erros.join(',')}`)
            return false
        }

        return true
    }

    function getComponenteProp(obj: any, prop: Tipo, indice: number) {
        let valor = obj[prop.nome]

        const atribuiValor = valor => {
            let novoVo = _.cloneDeep(vo)
            novoVo[prop.nome] = valor
            setVo(novoVo)            
        }

        const propsCampo = {
            label: prop.titulo
            ,value: vo[prop.nome]
            ,onChange: atribuiValor
            ,className: `w-full md:col-span-${prop.colunas}`
            ,key: indice
            ,required: prop.required
        }
    
        if (prop.tipo.toLowerCase() === 'boolean') {
            return <CheckboxInput {...propsCampo} />
        } else if (prop.tipo.toLowerCase() === 'string' && prop.endpointColecao) {
            return <SelectComboColecao 
                campoLabel={prop.labelColecao}
                endpoint={prop.endpointColecao}

                {...propsCampo}

                onChange={valor => {
                    let novoVo = _.cloneDeep(vo)
                    novoVo[prop.nome] = valor ? valor[prop.labelColecao] : ''
                    setVo(novoVo)   
                }}
            />
        } else if (prop.tipo.toLowerCase() === 'string') {
            return <TextInput {...propsCampo} />
        } else if (prop.tipo.toLowerCase() === 'textarea') {
            return <TextAreaInput {...propsCampo} />
        } else if (prop.tipo.toLowerCase() === 'date') {
            return <DateInput {...propsCampo} />
        } else if (prop.tipo.toLowerCase() === 'double') {
            return <DoubleInput {...propsCampo} />
        } else if (prop.tipo.toLowerCase() === 'integer') {
            return <IntegerInput {...propsCampo} />
        }
    }

    return (
        <div className='px-2'>
            <div className='flex flex-wrap w-full h-full'>
                <div className='flex flex-row w-full justify-between'>
                    <Subtitulo>{`Alteração/Inclusão`}</Subtitulo>
                    <div className='flex'>
                        <BotaoVoltar 
                            className='mr-3'
                            onClick={props.voltar}
                        />
                        <BotaoGravar 
                            onClick={() => {
                                if (validaDados()) {
                                    props.gravar(vo)
                                }
                            }} />
                    </div>
                </div>
                
                <div className={`
                    w-full grid grid-cols-1 gap-2
                    md:grid-cols-${props.colunas}
                `}>
                    {
                        props.campos.map((campo, indice) => getComponenteProp(props.objEditado, campo, indice))
                    }
                </div>
            </div>
        </div>
      )
}