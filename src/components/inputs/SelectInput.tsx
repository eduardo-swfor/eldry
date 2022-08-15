import { useEffect, useState } from 'react'
import CaptionCampo from '../labels/CaptionCampo'

interface SelectInputProps {
  value?: string
  label?: string
  campoLabel?: string
  dados: []
  className?: string
  onChange?: (value: any) => void
  onItemSelecionado?: (value: any) => void
  slim?: boolean
  required?: boolean
  chave: string
  textoItem?: string
  readOnly?: boolean
}

export default function SelectInput(props: SelectInputProps) {
  const [itens, setItens] = useState([])
  const [itensExibir, setItensExibir] = useState([])
  const [estado, setEstado] = useState('')  

  useEffect(() => {    
    setItens(props.dados)

    if (props.dados) {
      const novosDados = []
    
      novosDados.push('', ...props.dados?.map(i => {
        return i[props.campoLabel] ? i[props.campoLabel] : i
      }))
      
      setItensExibir(novosDados)
    }
    
    setEstado(props.textoItem !== undefined ? props.textoItem : '')

    return () => {
      setItens([])
      setItensExibir([])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.dados, props.textoItem])

  return (
    <div className={`
      ${props.className}
      flex flex-col justify-center
    `}>
        {!props.label ? null : <CaptionCampo className='mt-1'>{(props.required ? '*' : '') + props.label}</CaptionCampo>}
        <select
          className={`
            p-1 placeholder-gray-400 text-gray-600
            ${props.readOnly ? 'bg-gray-50' : 'bg-white'} 
            rounded text-sm border focus:outline-none focus:ring 
            uppercase w-full
          `}

          value={estado}

          onChange={evt=>{
            if (props.readOnly) {
                return
            }

            const ret = itens.filter(i => i[props.campoLabel] === evt.target.value || i === evt.target.value)

            if (ret.length > 0) {
              if (props.campoLabel) {
                setEstado(ret[0])
              } else {
                setEstado(ret[0][props.campoLabel])
              }
            }
            setEstado(evt.target.value)
            
            if (props.onItemSelecionado != null) {              
              props.onItemSelecionado(ret.length > 0 ? ret[0] : null)
            }

            if (props.onChange != null) {
              props.onChange(ret.length > 0 ? ret[0] : null)
            }
            
          }}
        >        
          {
            itensExibir.map((item, indice) => <option key={indice} >{item}</option>)
          }
        </select>
    </div>
  )    
}