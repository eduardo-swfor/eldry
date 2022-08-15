import DateInput from '../../components/inputs/DateInput'
import SelectBancoPagamento from '../../components/telas/banco/SelectBancoPagamento'
import SelectTipoComprovante from '../../components/telas/tipo-comprovante/SelectTipoComprovante'
import CampoPesquisaEmpresa from '../../components/telas/empresa/CampoPesquisaEmpresa'
import Layout from '../../components/template/Layout'
import TabelaDados from '../../components/tabelas/TabelaDados'
import BotaoDownloadArquivo from '../../components/botoes/BotaoDownloadArquivo'
import BotaoPesquisa from '../../components/botoes/BotaoPesquisa'
import { useState } from 'react'
import useAppData from '../../data/hook/useAppData'
import endpoints from '../../data/endpoints.json'
import { IconeColecao } from '../../components/icons'

export default function PesquisaComprovante() {
  const [dados, setDados] = useState([])
  const [parametros, setParametros] = useState([])

  const { listarColecao, alerta } = useAppData()

    const jsxBotoes = (p) => {
        return <div>      
            <BotaoDownloadArquivo 
                chave={p.arquivo.nomeGravado} 
                nome={p.arquivo.nomeOriginal}
            />
        </div>
    }

    return (
        <Layout titulo='Pesquisa de comprovantes' icone={IconeColecao()}>        
            <div className='flex flex-wrap w-full h-full'>
                <div className='grid grid-cols-1 md:grid-cols-4 gap-2 w-full'>                    

                    <SelectTipoComprovante 
                        className='w-full'
                        onChange={valor => {
                            setParametros({...parametros, tipo: valor})
                        }}
                    />
                    <DateInput 
                        label='Início'
                        className='w-full'
                        onChange={valor => {
                            setParametros({...parametros, dataInicio: valor})
                        }}
                    />
                    <DateInput 
                        label='Fim'
                        className='w-full'
                        onChange={valor => {
                            setParametros({...parametros, dataFim: valor})
                        }}
                    />
                    <SelectBancoPagamento
                        className='w-full'
                        onChange={valor => {
                            setParametros({...parametros, codigoBanco: valor ? valor.codigo : null})
                        }}
                    />
                    <div className='md:col-span-4 flex flex-col md:flex-row w-full items-end md:items-center' >
                        <CampoPesquisaEmpresa 
                            className='w-full'
                            onChange={valor => {
                                setParametros({...parametros, codigoEmpresa: valor ? valor.codigo : null})
                            }}
                        />
                        <BotaoPesquisa 
                            className='md:ml-2 md:mt-5'
                            onClick={() => {
                                listarColecao(endpoints.COMPROVANTE, {...parametros, relatorio: true}).then(lista => {
                                    setDados(lista)
                                })
                            }}
                        />
                    </div>
                </div>

                <div className='text-xs flex flex-wrap'>
                    {`    
                        *esta pesquisa só exibirá os primeiros 100 registros, 
                        caso seu comprovante não esteja listado abaixo,
                        tente restringir as datas da pesquisa e tente novamente
                    `}
                </div>
                
                <TabelaDados 
                    className='w-full max-h-screen'
                    propriedades={[
                        {nome: 'tipo', tipo: 'string', titulo: 'Tipo' }, 
                        {nome: 'empresa.codigo', tipo: 'string', titulo: 'Código' },  
                        {nome: 'empresa.nome', tipo: 'string', titulo: 'Empresa' },  
                        {nome: 'data', tipo: 'date', titulo: 'Data' }, 
                        {nome: 'banco.nome', tipo: 'string', titulo: 'Banco' },  
                        {nome: 'acoes', tipo: 'jsx', titulo: 'Ações', jsx: jsxBotoes }
                    ]} 
                    titulo='Pesquisa'
                    dados={dados}
                />
            </div>
        </Layout>
    )
}