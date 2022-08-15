import DateInput from '../../components/inputs/DateInput'
import SelectStatusOcorrencia from '../../components/telas/ocorrencias/SelectStatusOcorrencia'
import SelectTipoPrincipalOcorrencia from '../../components/telas/ocorrencias/SelectTipoPrincipalOcorrencia'
import SelectTipoOcorrencia from '../../components/telas/ocorrencias/SelectTipoOcorrencia'
import CampoPesquisaEmpresa from '../../components/telas/empresa/CampoPesquisaEmpresa'
import Layout from '../../components/template/Layout'
import TabelaDados from '../../components/tabelas/TabelaDados'
import TextInput from '../../components/inputs/TextInput'
import Subtitulo from '../../components/labels/Subtitulo'
import CheckboxInput from '../../components/inputs/CheckboxInput'
import BotaoOk from '../../components/botoes/BotaoOk'
import BotaoEditarTabela from '../../components/botoes/BotaoEditarTabela'
import BotaoPesquisa from '../../components/botoes/BotaoPesquisa'
import { useState } from 'react'
import useAppData from '../../data/hook/useAppData'
import endpoints from '../../data/endpoints.json'
import { IconeArquivo } from '../../components/icons'
import { useRouter } from 'next/router'
import SelectResponsavel from '../../components/telas/responsavel/SelectResponsavel'
import If from '../../components/utils/If'
import StatusOcorrencia from '../../data/status-ocorrencia.json'

export default function PesquisaOcorrencia() {
    const [dados, setDados] = useState([])
    const [parametros, setParametros] = useState([])
    const router = useRouter()  
    const { listarColecao, exibirToast, pergunta, gravarObj } = useAppData()
    const [novoResponsavel, setNovoResponsavel] = useState(null)

    const pesquisa = () => {
        listarColecao(endpoints.OCORRENCIA, {...parametros, relatorio: true}).then(lista => {
            if (lista.length == 0) {
                exibirToast('Nenhum registro encontrado', 'a')
            } else {
                exibirToast('Pesquisa concluída', 'i')
            }

            setDados(lista)
        })
    }

    const jsxBotoes = p => {
        return <div className='flex'>    
            {
                p.dataEncerramento ?
                    null :
                    <CheckboxInput 
                        value={p.marcado}
                        onChange={valor => {
                            const novosDados = dados.map(item => {
                                if (item._id === p._id) {
                                    item.marcado = valor
                                }

                                return item
                            })
                            
                            setDados(novosDados)
                        }}
                    />
            }  
            
            <BotaoEditarTabela 
                onClick={() => {
                    router.push(`/ocorrencias/editar-oc?sequencia=${p.sequencia}`)
                }}

                className='ml-2'
            />
        </div>
    }

    const jsxNovoResponsavel = () => {
        return (
            <div className='flex flex-col w-full mt-2 md:w-2/3'>
                <Subtitulo>{`Selecione um novo responsável para as ocorrências selecionadas`}</Subtitulo>

                <div className='flex flex-row w-full items-center'>
                    <SelectResponsavel 
                        className='w-full'
                        value={novoResponsavel}
                        label=''
                        onChange={setNovoResponsavel}
                    />
                    {
                        novoResponsavel == null ?
                            null :
                            <BotaoOk 
                                className='mt-4 ml-2'                            
                                onClick={() => {
                                    pergunta(`As ocorrências selecionadas serão distribuídas para '${novoResponsavel.toLowerCase()}'. Confirma?`, async () => {
                                        const apontamentos = dados.filter(item => item.marcado).map(item => {
                                            return {
                                                status: StatusOcorrencia.REDISTRIBUIDO, 
                                                resposta: `REDISTRIBUÍDO PARA ${novoResponsavel}`,
                                                novoResponsavel,
                                                ocorrencia: item
                                            }
                                        })

                                        await gravarObj(endpoints.APONTAMENTO, { multiplos: true, apontamentos })
                                        pesquisa()
                                    })

                                }}
                            />
                    }
                    
                </div>
                
            </div>
        )
    }

    return (
        <Layout titulo='Pesquisa de ocorrências' icone={IconeArquivo()}>        
            <div className='flex flex-wrap w-full h-full'>
                <div className='grid grid-cols-1 md:grid-cols-4 gap-2 w-full'>   
                    <CampoPesquisaEmpresa 
                        className='w-full md:col-span-4' 
                        onChange={valor => {
                            setParametros({...parametros, 'empresa.codigo': valor ? valor.codigo : null})
                        }}
                    />     
                    <TextInput
                        className='w-full md:col-span-2'
                        label='Criado por'
                        onChange={valor => {
                            setParametros({...parametros, criadoPor: valor})
                        }}
                    />
                    <TextInput
                        className='w-full md:col-span-2'
                        label='Responsável atual'
                        onChange={valor => {
                            setParametros({...parametros, responsavelAtual: valor})
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
                    <TextInput
                        className='w-full md:col-span-2'
                        label='Sequência'
                        onChange={valor => {
                            setParametros({...parametros, sequencia: valor})
                        }}
                    />
                    <SelectStatusOcorrencia 
                        className='w-full md:col-span-1'
                        onChange={valor => {
                            setParametros({...parametros, status: valor})
                        }}
                    />
                    <SelectTipoPrincipalOcorrencia 
                        className='w-full md:col-span-1'
                        onChange={valor => {
                            setParametros({...parametros, tipoPrincipal: valor})
                        }}
                    />
                    <SelectTipoOcorrencia
                        className='w-full md:col-span-2'
                        onChange={valor => {
                            setParametros({...parametros, tipoOcorrencia: valor})
                        }}
                    />

                    <div className='flex justify-end md:col-span-4 w-full my-2'>
                        <BotaoPesquisa 
                            onClick={() => {
                                pesquisa()
                            }}
                        />
                    </div>
                    
                </div>

                <div className='text-xs flex flex-wrap'>
                    {`    
                        *esta pesquisa só exibirá os primeiros 2000 registros, 
                        caso a ocorrência não esteja listada abaixo,
                        tente restringir os filtros da pesquisa e tente novamente
                    `}
                </div>
                
                <TabelaDados 
                    className='w-full max-h-screen'
                    propriedades={[
                        {nome: 'acoes', tipo: 'jsx', titulo: 'Ações', jsx: jsxBotoes},
                        {nome: 'sequencia', tipo: 'string', titulo: 'Sequência' }, 
                        {nome: 'empresa.codigo', tipo: 'string', titulo: 'Empresa' }, 
                        {nome: 'dataHoraRegistro', tipo: 'datetime', titulo: 'Data/Hora' }, 
                        {nome: 'codigoFornecedor', tipo: 'string', titulo: 'Cod forn' }, 
                        {nome: 'sla', tipo: 'integer', titulo: 'SLA' },
                        {nome: 'status', tipo: 'string', titulo: 'Status' }, 
                        {nome: 'tipoOcorrencia', tipo: 'string', titulo: 'Tipo' }, 
                        {nome: 'descricaoOcorrencia', tipo: 'string', titulo: 'Descrição' },
                        {nome: 'responsavelAtual', tipo: 'string', titulo: 'Responsável' }
                    ]} 
                    titulo='Pesquisa'
                    dados={dados}
                />

                <If exibir={dados.filter(item => item.marcado).length > 0}>
                    {jsxNovoResponsavel()}
                </If>
            </div>
        </Layout>
    )
}