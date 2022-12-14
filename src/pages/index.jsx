import useAppData from '../data/hook/useAppData'
import Layout from '../components/template/Layout'
import TabelaDados from '../components/tabelas/TabelaDados'
import Subtitulo from '../components/labels/Subtitulo'
import TextoPequeno from '../components/labels/TextoPequeno'
import DateInput from '../components/inputs/DateInput'
import TextInput from '../components/inputs/TextInput'
import BotaoPesquisa from '../components/botoes/BotaoPesquisa'
import BotaoRefresh from '../components/botoes/BotaoRefresh'
import { useState, useEffect } from 'react'
import { IconeCasa, IconeExclamacao, IconeRelogio } from '../components/icons'
import useAuth from '../data/hook/useAuth'
import BotaoEditarTabela from '../components/botoes/BotaoEditarTabela'
import { useRouter } from 'next/router'
import { adicionaDiasNaData, formataData } from '../utils/DateUtils'
import endpoints from '../data/endpoints.json'
import Image from 'next/image'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import BotaoVoltarVermelho from '../components/botoes/BotaoVoltarVermelho'
import BotaoDownloadArquivo from '../components/botoes/BotaoDownloadArquivo'
import Titulo from '../components/labels/Titulo'
import Link from 'next/link'
import FileDownload from 'js-file-download'

export default function Home() {
  const [minhasPendencias, setMinhasPendencias] = useState([])
  const [aguardardandoAcao, setAguardardandoAcao] = useState([])
  const [ocorrenciasPesquisadas, setOcorrenciasPesquisadas] = useState([])
  const [datas, setDatas] = useState({ dataInicio: adicionaDiasNaData(-30, new Date()), dataFim: new Date() })
  const [sequenciaPesquisada, setSequenciaPesquisada] = useState('')
  const [atualizar, setAtualizar] = useState(false)

  const router = useRouter()
  const { usuario } = useAuth()
  const { axiosGet, exibirToast, axiosDownload } = useAppData()
  const [imagemMensagem, setImagemMensagem] = useState(null)

  useEffect(() => {
    const dataArmazenada = localStorage.getItem('dataMensagem')
    const dataStr = formataData(new Date())

    if (!dataArmazenada || dataArmazenada != dataStr) {
    localStorage.setItem('dataMensagem', dataStr)

    axiosGet(endpoints.MENSAGEM, { diario: true }).then(retorno => {
      if (retorno.length > 0) {
        //setImagemMensagem(`https://${process.env.NEXT_PUBLIC_AWS_BUCKET}.${process.env.NEXT_PUBLIC_AWS_STORAGE_ENDPOINT}/${retorno[0].arquivo.diretorio}/${retorno[0].arquivo.nomeGravado}`)
        setImagemMensagem(retorno[0].arquivo)
      }
    })
    }

    if (usuario?.email) {
      axiosGet(endpoints.OCORRENCIA, { email: usuario.email }).then(retorno => {
        setMinhasPendencias(retorno.pendencias)
        setAguardardandoAcao(retorno.aguardando)
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario, atualizar])

  const jsxBotoes = (p) => {
    return <div>
      <BotaoEditarTabela onClick={() => {
        router.push(`/ocorrencias/editar-oc?sequencia=${p.sequencia}`)
      }} />
    </div>
  }

  const jsxBotoesVisualizar = (p) => {
    return <div>
      <BotaoEditarTabela label='Hist??rico' onClick={() => {
        router.push(`/ocorrencias/editar-oc?sequencia=${p.sequencia}`)
      }} />
    </div>
  }

  return imagemMensagem ?
    <div className='flex flex-col h-full w-full items-start m-4'>
      <div className='flex flex-row'>
        <BotaoVoltarVermelho
          className=''
          onClick={() => {
            setImagemMensagem(null)
          }}
        />

        <Titulo className='ml-4'>
          {'A mensagem abaixo foi registrada, para voltar para o sistema use o bot??o ao lado'}
        </Titulo>
      </div>
      <BotaoDownloadArquivo
        className='mt-2'
        chave={imagemMensagem.nomeGravado}
        label={`Download ${imagemMensagem.nomeOriginal}`}
        nome={imagemMensagem.nomeOriginal}
      />      

      <div className='w-full m-4 mb-8 p-2 overflow-auto '>
        <Zoom>
          <Image
            src={`https://${process.env.NEXT_PUBLIC_AWS_BUCKET}.${process.env.NEXT_PUBLIC_AWS_STORAGE_ENDPOINT}/${imagemMensagem.diretorio}/${imagemMensagem.nomeGravado}`}
            layout='responsive'
            quality={100}
            objectFit='initial'
            loading='eager'
            priority={true}
            alt='Mensagem'
            height={'100%'}
            width={'100%'}
          />
        </Zoom>
      </div>
    </div> :
    <Layout titulo='Caixa de entrada' icone={IconeCasa()}>
      <div className='flex items-center'>
        <Subtitulo className='flex-grow text-red-500'>
          Na tabela abaixo voc?? vai encontrar todas as ocorr??ncias que precisam da sua aten????o
        </Subtitulo>

        <BotaoRefresh
          onClick={async () => {
            setAtualizar(!atualizar)
          }}
        />
      </div>

      <TabelaDados
        className='mt-4 w-full max-h-96'
        propriedades={[
          { nome: 'acoes', tipo: 'jsx', titulo: 'A????es', jsx: jsxBotoes },
          { nome: 'status', tipo: 'string', titulo: 'Status' },
          { nome: 'sequencia', tipo: 'string', titulo: 'Sequ??ncia' },
          { nome: 'tipoOcorrencia', tipo: 'string', titulo: 'Tipo' },
          { nome: 'qtdArquivos', tipo: 'string', titulo: 'Qtd arquivos' },
          { nome: 'descricaoOcorrencia', tipo: 'string', titulo: 'Descri????o' },
          { nome: 'dataUltimaAtualizacao', tipo: 'date', titulo: 'Atualizado em' },
        ]}
        titulo='Minhas pend??ncias'
        dados={minhasPendencias.map(item => {
          return {
            ...item,
            qtdArquivos: item.arquivos?.length || 0
          }
        })}
        icone={IconeExclamacao(5)}
      />

      <div className='flex w-full border-b content-end pt-2 mb-4' />

      <Subtitulo className='flex-grow'>
        Na tabela abaixo est??o listadas todas as ocorr??ncias
        criadas por voc?? e que aguardam atualiza????o
      </Subtitulo>
      <TabelaDados
        className='mt-4 w-full max-h-96'
        propriedades={[
          { nome: 'acoes', tipo: 'jsx', titulo: 'A????es', jsx: jsxBotoesVisualizar },
          { nome: 'sequencia', tipo: 'string', titulo: 'Sequ??ncia' },
          { nome: 'status', tipo: 'string', titulo: 'Status' },
          { nome: 'tipoOcorrencia', tipo: 'string', titulo: 'Tipo' },
          { nome: 'qtdArquivos', tipo: 'string', titulo: 'Qtd arquivos' },
          { nome: 'descricaoOcorrencia', tipo: 'string', titulo: 'Descri????o' },
          { nome: 'dataUltimaAtualizacao', tipo: 'date', titulo: 'Atualizado em' },
        ]}
        titulo='Aguardando atualiza????es'
        dados={aguardardandoAcao.map(item => {
          return {
            ...item,
            qtdArquivos: item.arquivos?.length || 0
          }
        })}
        icone={IconeRelogio(5)}
      />

      <div className='flex w-full border-b content-end pt-2 mb-4' />

      <Subtitulo className='flex-grow'>
        Pesquisa das ??ltimas ocorr??ncias criadas ou atribuidas para o usu??rio logado
      </Subtitulo>

      <TextoPequeno className='-mt-2'>
        *ser?? exibido no m??ximo 100 registros na tabela abaixo
      </TextoPequeno>

      <div className='flex flex-col md:flex-row content-end'>
        <DateInput
          label='In??cio'
          readOnly={sequenciaPesquisada}
          value={datas.dataInicio}
          setData={valor => setDatas({ ...datas, dataInicio: valor })}
        />

        <DateInput
          label='Fim'
          readOnly={sequenciaPesquisada}
          className='md:ml-2'
          value={datas.dataFim}
          setData={valor => setDatas({ ...datas, dataFim: valor })}
        />

        <TextInput
          label='Sequ??ncia'
          className='md:ml-2'
          value={sequenciaPesquisada}
          onChange={valor => {
            setSequenciaPesquisada(valor)
          }}
        />

        <BotaoPesquisa
          className='md:mt-8 md:ml-4 self-start'
          onClick={() => {
            const params = sequenciaPesquisada ?
              {
                sequencia: sequenciaPesquisada
              } :
              {
                pesquisaData: true,
                dataInicio: formataData(datas.dataInicio),
                dataFim: formataData(datas.dataFim),
                email: usuario.email
              }

            axiosGet(endpoints.OCORRENCIA, params).then(retorno => {
              setOcorrenciasPesquisadas(Array.isArray(retorno) ? retorno : [retorno])

              if (retorno.length == 0) {
                exibirToast('Nenhum registro foi encontrado', 'warning')
              } else {
                exibirToast(`${retorno.length} registro(s) encontrado(s)`, 's')
              }
            })
          }}
        />
      </div>

      {sequenciaPesquisada ? <Subtitulo>As datas ser??o desconsideradas na pesquisa</Subtitulo> : ''}

      <TabelaDados
        className='mt-4 w-full  max-h-96'
        propriedades={[
          { nome: 'acoes', tipo: 'jsx', titulo: 'A????es', jsx: jsxBotoesVisualizar },
          { nome: 'sequencia', tipo: 'string', titulo: 'Sequ??ncia' },
          { nome: 'status', tipo: 'string', titulo: 'Status' },
          { nome: 'tipoOcorrencia', tipo: 'string', titulo: 'Tipo' },
          { nome: 'descricaoOcorrencia', tipo: 'string', titulo: 'Descri????o' },
          { nome: 'dataRegistro', tipo: 'date', titulo: 'Criado em' },
        ]}
        titulo='Hist??rico'
        dados={ocorrenciasPesquisadas}
        icone={IconeRelogio(5)}
      />
    </Layout>
}