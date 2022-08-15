import SearchInput from '../inputs/SearchInput'
import Subtitulo from '../labels/Subtitulo'
import TabelaDados, { Tipo } from '../tabelas/TabelaDados'
import BotaoNovo from '../botoes/BotaoNovo'
import BotaoEditarTabela from '../botoes/BotaoEditarTabela'
import BotaoExcluirTabela from '../botoes/BotaoExcluirTabela'
import { useEffect, useState } from 'react'
import { IconePesquisa } from '../icons'

interface PesquisaProps {
  novo: () => void
  dados: any[]
  editar: (vo:any) => void
  excluir: (vo:any) => void
  aplicaFiltro: (vo:any, valorFiltro: string) => boolean
  campos: Tipo[]
}

export default function Pesquisa(props: PesquisaProps) {
  const [dadosOriginais, setDadosOriginais] = useState([])
  const [dadosFiltrados, setDadosFiltrados] = useState([])

  useEffect(() => {
    setDadosOriginais(props.dados)
    setDadosFiltrados(props.dados)
  }, [setDadosFiltrados, props.dados])

  const jsxBotoes = (p: any) => {
    return <div>
      <BotaoExcluirTabela onClick={() => {
        props.excluir(p)
      }}/>
      <BotaoEditarTabela onClick={() => {
        props.editar(p)
      }}/>      
    </div>
  }

  return (
      <div className='px-2'>
          <div className='flex flex-wrap w-full h-full'>
          <div className='flex flex-row w-full items-center'>
            <SearchInput 
              placeholder='Digite o texto para pesquisa' 
              className='w-full mr-2' 
              value='' 
              onChange={valor => {
                if (valor.toUpperCase().trim().length == 0) {
                  setDadosFiltrados(dadosOriginais)
                } else {
                  setDadosFiltrados(dadosOriginais.filter(i => {
                    return props.aplicaFiltro(i, valor)
                  }))
                }

                
              }}
            />
            <BotaoNovo 
                onClick={() => {
                  props.novo()
                }} 
            />
          </div>
  
          

          <TabelaDados 
              className='w-full'
              propriedades={[
                {nome: 'acoes', tipo: 'jsx', titulo: 'Ações', jsx: jsxBotoes },
                ...props.campos
              ]} 
              titulo='Itens cadastrados'
              dados={dadosFiltrados}
              icone={IconePesquisa()}
          />        
          </div>
      </div>
    )
}