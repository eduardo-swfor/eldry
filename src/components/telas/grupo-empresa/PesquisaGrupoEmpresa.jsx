import SearchInput from '../../inputs/SearchInput'
import Subtitulo from '../../labels/Subtitulo'
import TabelaDados from '../../tabelas/TabelaDados'
import BotaoNovo from '../../botoes/BotaoNovo'
import BotaoEditarTabela from '../../botoes/BotaoEditarTabela'
import BotaoExcluirTabela from '../../botoes/BotaoExcluirTabela'
import { useEffect, useState } from 'react'

export default function PesquisaDominio({novo, dados, editar, excluir}) {
  const [dadosOriginais, setDadosOriginais] = useState([])
  const [dadosFiltrados, setDadosFiltrados] = useState([])

  useEffect(() => {
    setDadosOriginais(dados)
    setDadosFiltrados(dados)
  }, [setDadosFiltrados, dados])

  const jsxBotoes = (p) => {
    return <div>
      <BotaoExcluirTabela label='' onClick={() => {
        excluir(p)
      }}/>
      <BotaoEditarTabela onClick={() => {
        editar(p)
      }}/>
    </div>
  }

  return (
      <div className='px-2'>
          <div className='flex flex-wrap w-full h-full'>
          <div className='flex flex-row w-full'>
              <Subtitulo className='flex-grow'>Pesquisa de grupos de empresas</Subtitulo>
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
                  return i.nome.toUpperCase().indexOf(valor.toUpperCase().trim()) >= 0
                }))
              }

              
            }}
          />

          <TabelaDados 
              className='w-full'
              propriedades={[
                {nome: 'nome', tipo: 'string', titulo: 'Perfil' }, 
                {nome: 'acoes', tipo: 'jsx', titulo: 'Ações', jsx: jsxBotoes }
              ]} 
              titulo='Pesquisa'
              dados={dadosFiltrados}
          />        
          </div>
      </div>
    )
}