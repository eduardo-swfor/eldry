import useAppData from '../../data/hook/useAppData'
import Layout from '../../components/template/Layout'
import TabelaDados from '../../components/tabelas/TabelaDados'
import Subtitulo from '../../components/labels/Subtitulo'
import BotaoRefresh from '../../components/botoes/BotaoRefresh'
import { useState, useEffect } from 'react'
import { IconeExclamacao } from '../../components/icons'
import BotaoEditarTabela from '../../components/botoes/BotaoEditarTabela'
import { useRouter } from 'next/router'
import endpoints from '../../data/endpoints.json'
import If from '../../components/utils/If'
import SelectResponsavel from '../../components/telas/responsavel/SelectResponsavel'
import CheckboxInput from '../../components/inputs/CheckboxInput'
import BotaoOk from '../../components/botoes/BotaoOk'
import StatusOcorrencia from '../../data/status-ocorrencia.json'

export default function OcorrenciasSemResponsavel() {
  const [ocorrencias, setOcorrencias] = useState([])
  const [atualizar, setAtualizar] = useState(false)
  const [novoResponsavel, setNovoResponsavel] = useState(null)
  const router = useRouter()
  const { axiosGet, pergunta, gravarObj } = useAppData()

  useEffect(() => {   
    axiosGet(endpoints.OCORRENCIA, {semResponsavel: true}).then(retorno =>{
        setOcorrencias(retorno)
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [atualizar])

  const jsxBotoes = (p) => {
    return <div className='flex'>
        {
          p.dataEncerramento ?
              null :
              <CheckboxInput 
                  value={p.marcado}
                  onChange={valor => {
                      const novosDados = ocorrencias.map(item => {
                          if (item._id === p._id) {
                              item.marcado = valor
                          }

                          return item
                      })
                      
                      setOcorrencias(novosDados)
                  }}
              />
      }  
      <BotaoEditarTabela onClick={() => {
        router.push(`/ocorrencias/editar-oc?sequencia=${p.sequencia}`)
      }}/>
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
                                    const apontamentos = ocorrencias.filter(item => item.marcado).map(item => {
                                        return {
                                            status: StatusOcorrencia.REDISTRIBUIDO, 
                                            resposta: `REDISTRIBUÍDO PARA ${novoResponsavel}`,
                                            novoResponsavel,
                                            ocorrencia: item
                                        }
                                    })

                                    await gravarObj(endpoints.APONTAMENTO, { multiplos: true, apontamentos })
                                    setAtualizar(!atualizar)
                                })

                            }}
                        />
                }
                
            </div>
            
        </div>
    )
  }

  return (
    <Layout titulo='Ocorrências sem responsável atribuído' icone={IconeExclamacao()}>
      <div className='flex items-center'>
        <Subtitulo className='flex-grow text-red-500'>
          Na tabela abaixo você vai encontrar todas as ocorrências que não tem responsável atribuído,
          por favor verifique todas e atribua a um responsável da área de pagamentos
        </Subtitulo>

        <BotaoRefresh 
          onClick={async () => {
            setAtualizar(!atualizar)
          }} 
        />
      </div>

      <TabelaDados 
        className='mt-4 w-full'
        propriedades={[
          {nome: 'acoes', tipo: 'jsx', titulo: 'Ações', jsx: jsxBotoes },
          {nome: 'status', tipo: 'string', titulo: 'Status' },
          {nome: 'sequencia', tipo: 'string', titulo: 'Sequência' },
          {nome: 'tipoOcorrencia', tipo: 'string', titulo: 'Tipo' },
          {nome: 'descricaoOcorrencia', tipo: 'string', titulo: 'Descrição' },
          {nome: 'dataRegistro', tipo: 'date', titulo: 'Criado em' },
        ]} 
        titulo='Ocorrências com pendência'
        dados={ocorrencias}
        icone={IconeExclamacao(5)}
      />

      <If exibir={ocorrencias.filter(item => item.marcado).length > 0}>
          {jsxNovoResponsavel()}
      </If>
    </Layout>
  )
}