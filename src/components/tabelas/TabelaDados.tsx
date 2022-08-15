import { 
  IconeDatabase, IconeDownload, IconeSetaCimaPequena, 
  IconeSetaBaixoPequena, IconeMenos, IconeFiltro } from '../icons'
import Subtitulo from '../labels/Subtitulo'
import TextInput from '../inputs/TextInput'
import DoubleInput from '../inputs/DoubleInput'
import IntegerInput from '../inputs/IntegerInput'
import DateInput from '../inputs/DateInput'
import CheckboxInput from '../inputs/CheckboxInput'
import { dataSemHora, formataData, formataDataHora, parseData, parseDataHora } from '../../utils/DateUtils'
import { formataNumeroMilhar } from '../../utils/NumeroUtils'
import useAppData from '../../data/hook/useAppData'
import writeXlsxFile from 'write-excel-file'
import { useState, useMemo } from 'react'
import _ from 'lodash'
import FormFiltroTabela from './FormFiltroTabela'

export interface Tipo {
  nome: string
  titulo?: string
  tipo: string
  edicao?: boolean
  grow?: boolean
  jsx?: any
  formatacao?: (valor: any, formatacao: string) => string
  onChange?: (vo: any) => void 
  naoConverterCaixa?: boolean
}

export interface TabelaDadosProps {
  titulo: string
  propriedades: Tipo[]
  dados: object[]
  jsxRodape?: any
  onChange?: (valor: any) => void
  icone?: any
  className?: string
  cssTabela?: string
}

export interface Ordem {
  nome: string
  crescente: boolean
}

export interface Filtro {
  nomeCampo: string
  valor: any
  aplicaFiltro: (valor: any) => boolean
}

export const formataValorParaExcel = (tipo, obj, nome) => {
  let valor 

  if (nome.indexOf('.') >= 0) {
    valor = nome.split('.').reduce((anterior, novo) => {
      if (!anterior) {
        return obj[novo]
      } else {
        return anterior[novo]
      }
    }, null)
  } else {
    valor = obj[nome]
  }

  if (!valor && valor !== 0 && valor !== false) {
    return ''
  }
  

  if (tipo.toLowerCase() === 'boolean') {
    return valor ? 'Sim' : 'Não'          
  } else if (tipo.toLowerCase() === 'string') {
    return valor.toString()
  } else if (tipo.toLowerCase() === 'date') {
    return formataData(valor)
  } else if (tipo.toLowerCase() === 'datetime') {
    return formataDataHora(valor)
  } else if (tipo.toLowerCase() === 'double') {
    return formataNumeroMilhar(valor)
  } else if (tipo.toLowerCase() === 'integer') {
    return valor.toString()
  } else if (tipo.toLowerCase() === 'array') {
    return valor ? valor.map(v => v.toString()).join(',') : ''
  }

  return ''
}

export const formataValorParaExcelFinal = (tipo, obj, nome) => {
  let valor 

  if (nome.indexOf('.') >= 0) {
    valor = nome.split('.').reduce((anterior, novo) => {
      if (!anterior) {
        return obj[novo]
      } else {
        return anterior[novo]
      }
    }, null)
  } else {
    valor = obj[nome]
  }

  if (!valor && valor !== 0 && valor !== false) {
    return ''
  }
  

  if (tipo.toLowerCase() === 'boolean') {
    return valor ? 'Sim' : 'Não'          
  } else if (tipo.toLowerCase() === 'string') {
    return valor.toString()
  } else if (tipo.toLowerCase() === 'date') {
    return dataSemHora(parseData(formataData(valor)))
  } else if (tipo.toLowerCase() === 'datetime') {
    return parseDataHora(formataDataHora(valor))
  } else if (tipo.toLowerCase() === 'double') {
    return isNaN(valor) ? null : valor
  } else if (tipo.toLowerCase() === 'integer') {
    return isNaN(valor) ? null : valor
  } else if (tipo.toLowerCase() === 'array') {
    return valor ? valor.map(v => v.toString()).join(',') : ''
  }

  return ''
}

export default function TabelaDados(props: TabelaDadosProps) {
  const coresCabecalho = 'bg-blue-900 text-white border-blueGray-100'
  const { exibirToast } = useAppData()
  const [campoOrdenacao, setCampoOrdenacao] = useState({} as Ordem)
  const [mostrarFiltro, setMostrarFiltro] = useState(Boolean)
  const [filtros, setFiltros] = useState([] as Filtro[])
  

  const dadosMemo = useMemo(() => {
    let resultado = _.sortBy(props.dados, [campoOrdenacao?.nome])
    return (campoOrdenacao?.crescente ? resultado : _.reverse(resultado)).filter(item => {
      const resultadoFiltros = filtros.reduce((a,n) => {
        if (!a || !n.aplicaFiltro(item)) {
          return false
        }

        return true
      }, true)
      
      return resultadoFiltros
    })
  }, [props.dados, campoOrdenacao, filtros])

  const getJsxCabecalho = (prop, indice) => {
    return (
      <th
        key={indice}
        className={`
          p-1 align-middle border-solid text-xs ${prop.tipo === 'jsx' ? '' : 'cursor-pointer'}
          uppercase border-l-0 border-r-0 whitespace-nowrap 
          font-semibold text-left ${coresCabecalho}
          border-gray-20 border
          ${prop.grow ? 'flex-grow' : ''}
        `}
        colSpan={prop.span}
        onClick={() => {
          if (prop.tipo === 'jsx') {
            return
          }

          setCampoOrdenacao({
            nome: prop.nome,
            crescente: campoOrdenacao?.nome === prop.nome ? !campoOrdenacao.crescente : true
          })
        }}        
      >
        <div className='flex flex-col'>
          <div className='flex flex-row'>            
            {
              prop.tipo === 'jsx' ? 
                null :
                prop.nome === campoOrdenacao?.nome ? 
                  <div className='mr-1 mt-0.5'>
                    {
                      campoOrdenacao.crescente ? IconeSetaCimaPequena(3) : IconeSetaBaixoPequena(3)
                    }
                  </div> : 
                  <div className='mr-1 mt-0.5'>
                    {IconeMenos(3)}
                  </div>
            }
            {!prop.titulo ? prop.nome : prop.titulo}
          </div>
        </div>
      </th>
    )
  }

  const getJsxItem = (obj, propriedade, indice, indiceLinha) => {
    return (
      <td
        key={indice}
        className={`
          border-gray-20 border 
          border-t-0 align-middle border-l-0 
          border-r-0 text-sm whitespace-nowrap p-1
          ${(indiceLinha % 2 === 0) ? ' bg-white' : 'bg-blueGray-100'}
        `}
        colSpan={propriedade.span}
      >
        {
          getComponenteProp(obj, propriedade)
        }
      </td>
    )
  }

  function getComponenteProp(obj, prop) {
    let valor = obj[prop.nome]
    const formatacao = prop.formatacao ? getFormatacao(valor, prop.formatacao) : ''

    if (prop.nome.indexOf('.') >= 0) {
      valor = prop.nome.split('.').reduce((anterior, novo) => {
        if (!anterior) {
          return obj[novo]
        } else {
          return anterior[novo]
        }
      }, null)
    }

    const changeValor = valor => {
      obj[prop.nome] = valor
      props.onChange && props.onChange(props.dados)
      prop.onChange && prop.onChange(obj)
    }

    if (prop.edicao) {
      if (prop.tipo.toLowerCase() === 'boolean') {
        return <CheckboxInput
          value={obj[prop.nome]}
          onChange={changeValor}
        />
      } else if (prop.tipo.toLowerCase() === 'string') {
        return <TextInput
          slim
          value={obj[prop.nome]}
          onChange={changeValor}
        />
      } else if (prop.tipo.toLowerCase() === 'date') {
        return <DateInput
          slim
          value={obj[prop.nome]}
          onChange={changeValor}
        />
      } else if (prop.tipo.toLowerCase() === 'double') {
        return <DoubleInput
          slim
          value={obj[prop.nome]}
          onChange={changeValor}
        />
      } else if (prop.tipo.toLowerCase() === 'integer') {
        return <IntegerInput
          slim
          value={obj[prop.nome]}
          onChange={changeValor}
        />
      }
    } else if (prop.tipo.toLowerCase() === 'jsx') {
      return <>
        {prop.jsx(obj)}
      </>
    } else {
      if (valor === null || valor === undefined) {
        return null
      } if (prop.tipo.toLowerCase() === 'boolean') {
        return (
          <div className={formatacao}>
            {valor ? 'Sim' : 'Não'}
          </div>
        )
      } else if (prop.tipo.toLowerCase() === 'string') {
        return (
          <div className={formatacao}>
            {valor}
          </div>
        )
      } else if (prop.tipo.toLowerCase() === 'date') {
        return (
          <div className={`${formatacao}`}>
            {formataData(valor)}
          </div>
        )
      } else if (prop.tipo.toLowerCase() === 'datetime') {
        return (
          <div className={`${formatacao}`}>
            {formataDataHora(valor)}
          </div>
        )
      } else if (prop.tipo.toLowerCase() === 'double') {
        return (
          <div className={`${formatacao}`}>
            {formataNumeroMilhar(valor)}
          </div>
        )
      } else if (prop.tipo.toLowerCase() === 'integer') {
        return (
          <div className={`${formatacao}`}>
            {valor}
          </div>
        )
      } else if (prop.tipo.toLowerCase() === 'array') {
        return (
          <div className={formatacao}>
            {valor ? valor.map(v => v.toString()).join(',') : ''}
          </div>
        )
      }
    }
  }

  const getFormatacao = (obj: any, formatacao: any): string => {
    if (formatacao) {
      if (typeof formatacao === 'string') {
        return formatacao
      } else {
        return formatacao(obj)
      }
    }

    return ''
  }

  const getJsxLinhasTabela = (dados) => {
    if (!dados) {
      return null
    }

    return (
      dados.map((item: TabelaDadosProps, i) => {
        return (
          <tr key={i}>
            {props.propriedades.map((p, indice) => getJsxItem(item, p, indice, i))}
          </tr>
        )
      })
    )
  }

  const exportaExcel = async () => {
    if (!props?.dados?.length) {
      exibirToast('Não há dados para serem exportados', 'a')
      return
    }

    const tiposPermitidos = [
      'boolean', 'string', 'date',
      'datetime', 'double', 'integer']

    const schema = props.propriedades.
        filter(p => tiposPermitidos.find(t => t === p.tipo.toLowerCase())).
        map(p => {          
          let retorno = {
            column: p.titulo,
            //type: String,
            nome: p.nome,
            tipo: p.tipo,
            value: obj => obj[p.nome]
          }

          if (p.tipo.toLowerCase() === 'date' || p.tipo.toLowerCase() === 'datetime') {
            retorno['type'] = Date
            retorno['format'] = 'dd/mm/yyyy'
          } else if (p.tipo.toLowerCase() === 'double' || p.tipo.toLowerCase() === 'integer') {
            retorno['type'] = Number
          }
          
          return retorno
        })

    const dadosParaExportacao = props.dados.map(d => {
      let ret = {}

      schema.map(s => { 
        ret[s.nome] = formataValorParaExcelFinal(s.tipo, d, s.nome)
      })

      return ret
    })
    
    const blob = await writeXlsxFile(dadosParaExportacao, {
      schema,
      fileName: 'tabela.xlsx'
    })
  }

  const limiteExibirSuperior = 50

  return (
    <>
      <div
        className={`
        ${props.className}
          relative flex flex-col min-w-0 
          mb-2 shadow-md rounded mt-2
        `}>

        {/*Cabeçalho*/}
        <div className={`rounded-t mb-0 p-1 bg-gray-50 border flex flex-wrap`}>
          <div className={`flex w-full`}>
            <div className={`flex flex-grow `}>
              <div className='border-r'>
                <div 
                  className='mt-2 mr-1 cursor-pointer w-6'
                  onClick={() => {
                    setMostrarFiltro(!mostrarFiltro)
                  }}
                >
                  {IconeFiltro(4)}
                </div>
              </div>
              {
                props.icone ? 
                  <div className='ml-2 mt-1'>{props.icone}</div> : 
                  null
              }
              <Subtitulo className='ml-2 mt-1'>{props.titulo}</Subtitulo>              
            </div>
            <div
              className='cursor-pointer'
              onClick={() => {
                exportaExcel()
              }}
            >
              {IconeDownload()}
            </div>
            {
              props.dados?.length && props.dados.length >= limiteExibirSuperior ?
                <div className='text-sm ml-2'>
                  {dadosMemo?.length ? dadosMemo.length : '0'} registro(s)
                </div> :
                null
            }


          </div>

          {
            mostrarFiltro ?
              <FormFiltroTabela
                tipos={props.propriedades}
                fechar={() => {
                  setMostrarFiltro(false)
                }}
                aplicaFiltros={filtros => {
                  setFiltros(filtros)
                }}
              /> : 
              null
          }
        </div>

        <div className={`${props.cssTabela ? props.cssTabela : 'max-h-screen'} w-full overflow-x-auto`}>
          <table className='items-center w-full bg-transparent border-collapse'>

            {/* CABEÇALHO */}
            <thead>
              <tr className='sticky -top-1'>
                {props.propriedades.map((p, i) => getJsxCabecalho(p, i))}                
              </tr>
            </thead>

            {/* CORPO */}
            <tbody>
              {
                //getJsxLinhasTabela(props.dados)
                getJsxLinhasTabela(dadosMemo)
              }
            </tbody>
          </table>
        </div>

        {/*Rodapé*/}
        <div className={`
            flex flex-wrap rounded-b p-1 border-t 
            bg-gray-50 justify-between
          `}>
          <div className='text-sm flex-grow'>
            {dadosMemo?.length ? dadosMemo.length : '0'} registro(s)
          </div>
          <div>{props.jsxRodape}</div>
        </div>
      </div>
    </>
  )
}