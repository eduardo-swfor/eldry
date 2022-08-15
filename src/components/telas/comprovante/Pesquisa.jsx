import SearchInput from '../../inputs/SearchInput'
import Subtitulo from '../../labels/Subtitulo'
import TabelaDados from '../../tabelas/TabelaDados'
import BotaoNovo from '../../botoes/BotaoNovo'
import BotaoExcluirTabela from '../../botoes/BotaoExcluirTabela'
import BotaoDownloadArquivo from '../../botoes/BotaoDownloadArquivo'
import BotaoEditarTabela from '../../botoes/BotaoEditarTabela'
import { useEffect, useState } from 'react'
import { formataData } from '../../../utils/DateUtils'
import SelectTipoComprovante from '../tipo-comprovante/SelectTipoComprovante'
import DateInput from '../../inputs/DateInput'
import SelectBancoPagamento from '../banco/SelectBancoPagamento'
import CampoPesquisaEmpresa from '../empresa/CampoPesquisaEmpresa'
import BotaoPesquisa from '../../botoes/BotaoPesquisa'
import useAppData from '../../../data/hook/useAppData'
import endpoints from '../../../data/endpoints.json'

export default function PesquisaComprovante({ novo, excluir, edicao, dados }) {
  const [dadosOriginais, setDadosOriginais] = useState(dados)
  const { listarColecao } = useAppData()
  const [parametros, setParametros] = useState({})

  const jsxBotoes = (p) => {
    return <div>
      <BotaoEditarTabela onClick={() => {
        edicao(p)
      }}/>

      <BotaoDownloadArquivo
        chave={p.arquivo.nomeGravado}
        nome={p.arquivo.nomeOriginal}
      />

      <BotaoExcluirTabela onClick={() => {
        excluir(p)
      }} />
    </div>
  }

  return (
    <div className='px-2 flex flex-col'>
      <div className='flex flex-wrap w-full h-full'>
        <div className='flex flex-row w-full'>
          <Subtitulo className='flex-grow'>Pesquisa de comprovantes</Subtitulo>
          <BotaoNovo
            onClick={() => {
              novo()
            }}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-2 w-full'>

          <SelectTipoComprovante
            className='w-full'
            onChange={valor => {
              setParametros({ ...parametros, tipo: valor })
            }}
          />
          <DateInput
            label='Início'
            className='w-full'
            onChange={valor => {
              setParametros({ ...parametros, dataInicio: valor })
            }}
          />
          <DateInput
            label='Fim'
            className='w-full'
            onChange={valor => {
              setParametros({ ...parametros, dataFim: valor })
            }}
          />
          <SelectBancoPagamento
            className='w-full'
            onChange={valor => {
              setParametros({ ...parametros, codigoBanco: valor ? valor.codigo : null })
            }}
          />
          <div className='md:col-span-4 flex flex-col md:flex-row w-full items-end md:items-center' >
            <CampoPesquisaEmpresa
              className='w-full'
              onChange={valor => {
                setParametros({ ...parametros, codigoEmpresa: valor ? valor.codigo : null })
              }}
            />
            <BotaoPesquisa
              className='md:ml-2 md:mt-5'
              onClick={() => {
                listarColecao(endpoints.COMPROVANTE, { ...parametros, relatorio: true }).then(lista => {
                  setDadosOriginais(lista)
                })
              }}
            />
          </div>
        </div>

        <div className='text-xs flex flex-wrap'>
          *só estão sendo exibidos os últimos 500 registros
        </div>
        <TabelaDados
          className='w-full max-h-screen'
          propriedades={[
            { nome: 'acoes', tipo: 'jsx', titulo: 'Ações', jsx: jsxBotoes },
            { nome: 'tipo', tipo: 'string', titulo: 'Tipo' },
            { nome: 'empresa.codigo', tipo: 'string', titulo: 'Código' },
            { nome: 'empresa.nome', tipo: 'string', titulo: 'Empresa' },
            { nome: 'data', tipo: 'date', titulo: 'Data' },
            { nome: 'banco.nome', tipo: 'string', titulo: 'Banco' },
          ]}
          titulo='Pesquisa'
          dados={dadosOriginais}
        />
      </div>
    </div>
  )
}