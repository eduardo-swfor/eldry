import SearchInput from '../../inputs/SearchInput'
import Subtitulo from '../../labels/Subtitulo'
import TabelaDados from '../../tabelas/TabelaDados'
import BotaoNovo from '../../botoes/BotaoNovo'
import BotaoExcluirTabela from '../../botoes/BotaoExcluirTabela'
import BotaoDownloadArquivo from '../../botoes/BotaoDownloadArquivo'
import { useEffect, useState } from 'react'
import { formataData } from '../../../utils/DateUtils'

export default function PesquisaMensagem({novo, dados, excluir}) {
  const [dadosOriginais, setDadosOriginais] = useState([])
  const [dadosFiltrados, setDadosFiltrados] = useState([])

  useEffect(() => {
    setDadosOriginais(dados)
    setDadosFiltrados(dados)
  }, [setDadosFiltrados, dados])

  const jsxBotoes = (p) => {
    return <div>
      <BotaoExcluirTabela onClick={() => {
        excluir(p)
      }}/>
      
      <BotaoDownloadArquivo 
        chave={p.arquivo.nomeGravado} 
        nome={p.arquivo.nomeOriginal}
      />
    </div>
  }

  return (
      <div className='px-2'>
          <div className='flex flex-wrap w-full h-full'>
          <div className='flex flex-row w-full'>
              <Subtitulo className='flex-grow'>Pesquisa de mensagens</Subtitulo>
              <BotaoNovo 
                  onClick={() => {
                    novo()
                  }} 
              />
          </div>
  
          <SearchInput 
            placeholder='Digite o texto para pesquisa' 
            className='w-full' 
            value='' 
            onChange={valor => {
              if (valor.toUpperCase().trim().length == 0) {
                setDadosFiltrados(dadosOriginais)
              } else {
                setDadosFiltrados(dadosOriginais.filter(i => {
                  return i.descricao.toUpperCase().indexOf(valor.toUpperCase().trim()) >= 0 ||
                    formataData(i.dataInicio).indexOf(valor.toUpperCase().trim()) >= 0 ||
                    formataData(i.dataFim).indexOf(valor.toUpperCase().trim()) >= 0
                }))
              }

              
            }}
          />

          <TabelaDados 
              className='w-full'
              propriedades={[
                {nome: 'descricao', tipo: 'string', titulo: 'Descrição' }, 
                {nome: 'dataInicio', tipo: 'date', titulo: 'Início' }, 
                {nome: 'dataFim', tipo: 'date', titulo: 'Fim' }, 
                {nome: 'acoes', tipo: 'jsx', titulo: 'Ações', jsx: jsxBotoes }
              ]} 
              titulo='Pesquisa'
              dados={dadosFiltrados}
          />        
          </div>
      </div>
    )
}