import { useEffect, useState } from "react"
import Layout from '../../components/template/Layout'
import _ from 'lodash'
import { IconeDocumento, IconeExclamacao, IconePredio } from '../../components/icons'
import BotaoVoltar from '../../components/botoes/BotaoVoltar'
import BotaoProximo from '../../components/botoes/BotaoProximo'
import BotaoDownloadArquivo from '../../components/botoes/BotaoDownloadArquivo'
import useAppData from '../../data/hook/useAppData'
import TextInput from '../../components/inputs/TextInput'
import DateInput from '../../components/inputs/DateInput'
import Subtitulo from '../../components/labels/Subtitulo'
import TextAreaInput from '../../components/inputs/TextAreaInput'
import tipoOcorrencias from '../../data/tipos-ocorrencias.json'
import camposOcorrencias from '../../data/campos-ocorrencia.json'
import { formataTituloOcorrencia } from '../../components/telas/ocorrencias/TituloOcorrencia'
import { useRouter } from 'next/router'
import If from '../../components/utils/If'
import FormInclusaoApontamento from '../../components/telas/ocorrencias/FormInclusaoApontamento'
import FormApontamentos from '../../components/telas/ocorrencias/FormApontamentos'
import log from '../../utils/app-log'
import TabelaDados from '../../components/tabelas/TabelaDados'
import useAuth from '../../data/hook/useAuth'
import endpoints from '../../data/endpoints.json'
import MesAnoInput from '../../components/inputs/MesAnoInput'
import CheckboxInput from '../../components/inputs/CheckboxInput'

export default function EditarOc({ ocorrenciaInformada = null }) {
  const router = useRouter()
  const { alerta, listarColecao, uploadArquivoCadastro } = useAppData()
  const [ocorrencia, setOcorrencia] = useState(null)
  const [tipoOcorrencia, setTipoOcorrencia] = useState(null)
  const [atualizar, setAtualizar] = useState(false)
  const [perfil, setPerfil] = useState(false)
  const { usuario } = useAuth()
  const { axiosGet } = useAppData()

  useEffect(() => {
    if (usuario) {
      axiosGet(endpoints.CONSULTAR_PERFIL_USUARIO, { email: usuario.email }).then(retorno => {
        setPerfil(retorno)
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario])



  useEffect(() => {
    if (ocorrenciaInformada != null) {
      setOcorrencia(ocorrenciaInformada)

      const [i, s] = ocorrenciaInformada.tipoOcorrencia.toString().split('.').map(i => +i)
      const novoTipo = tipoOcorrencias[i - 1].itens[s - 1]
      setTipoOcorrencia(novoTipo)
    } else if (router.query.sequencia) {
      listarColecao(endpoints.OCORRENCIA, { sequencia: router.query.sequencia }).then(res => {
        setOcorrencia(res)

        if (res) {
          const [i, s] = res.tipoOcorrencia.toString().split('.').map(i => +i)
          const novoTipo = tipoOcorrencias[i - 1].itens[s - 1]
          setTipoOcorrencia(novoTipo)
        }
      })
    }


    return () => {
      setOcorrencia(null)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [atualizar, router.query.sequencia, ocorrenciaInformada])

  async function incluirApontamento(dados, arquivos) {
    if (!dados) {
      alerta('É necessário informar todos os dados do apontamento!')
      return
    }

    const dadosApontamento = _.cloneDeep(dados)
    dadosApontamento['ocorrencia'] = _.cloneDeep(ocorrencia)
    dadosApontamento['upload'] = arquivos?.length

    await uploadArquivoCadastro(
      endpoints.UPLOAD_APONTAMENTO,
      arquivos?.map(item => item.arquivo),
      dadosApontamento
    )
    setAtualizar(!atualizar)
  }

  const getComponenteCampo = (nome, indice) => {
    const configTitulo = camposOcorrencias[nome]
    const config = tipoOcorrencia.campos.filter(valor => valor.nome === nome).pop()
    const className = config.span ? `col-span-6 md:col-span-${config.span}` : ''

    if (!configTitulo || !config) {
      log('desenv', `Não foi possível encontrarconfigurações para o campo ${nome}`)
      log('desenv', `config = ${JSON.stringify(config)}`)
      log('desenv', `configTitulo = ${JSON.stringify(configTitulo)}`)
      return null
    } else {
      if (['string', 'combo', 'cnpj'].indexOf(configTitulo.tipo) >= 0) {
        return (
          <TextInput
            readOnly
            className={className}
            key={indice}
            label={configTitulo.titulo}
            value={ocorrencia ? ocorrencia[nome] : ''}
          />
        )
      } else if (configTitulo.tipo === 'textarea') {
        return (
          <TextAreaInput
            readOnly
            className={className}
            key={indice}
            label={configTitulo.titulo}
            value={ocorrencia ? ocorrencia[nome] : ''}
          />
        )
      } else if (configTitulo.tipo === 'empresa') {
        return (
          <TextInput
            readOnly
            className={className}
            key={indice}
            label={configTitulo.titulo}
            value={ocorrencia ? `${ocorrencia[nome].codigo} - ${ocorrencia[nome].nome}` : ''}
          />
        )
      } else if (configTitulo.tipo === 'banco') {
        return (
          <TextInput
            readOnly
            className={className}
            key={indice}
            label={configTitulo.titulo}
            value={ocorrencia ? `${ocorrencia[nome].codigo} - ${ocorrencia[nome].nome}` : ''}
          />
        )
      } else if (configTitulo.tipo === 'date') {
        return (
          <DateInput
            readOnly
            className={className}
            key={indice}
            label={configTitulo.titulo}
            value={ocorrencia ? ocorrencia[nome] : ''}
          />
        )
      } else if (configTitulo.tipo === 'competencia') {
        return (
          <MesAnoInput
            readOnly
            className={className}
            key={indice}
            label={configTitulo.titulo}
            value={ocorrencia ? ocorrencia[nome] : ''}
          />
        )
      } else if (configTitulo.tipo === 'checkbox') {
        return (
            <CheckboxInput 
                className={className}
                key={indice}
                label={configTitulo.titulo}
                value={ocorrencia ? ocorrencia[nome] : false}
                readOnly              
            />
        )
    } else if (configTitulo.tipo === 'empresas') {
        return (
          <div key={indice} className={`flex flex-wrap flex-col ${className}`}>
            <TabelaDados className='w-full'
              propriedades={[
                { nome: 'grupoEmpresa.nome', tipo: 'string', titulo: 'Grupo' },
                { nome: 'codigo', tipo: 'string', titulo: 'Código' },
                { nome: 'nome', tipo: 'string', titulo: 'Empresa' },
              ]}
              titulo='Empresas para inclusão de dados bancários'
              dados={!ocorrencia ? [] : ocorrencia[nome]}
              icone={IconePredio(5)}
            />
          </div>
        )
      } else if (configTitulo.tipo === 'upload') {
        return (
          <div key={indice} className={`flex flex-row flex-wrap ${className}`}>
            {
              ocorrencia?.arquivos?.map((arq, indiceBotao) => {
                return (
                  <BotaoDownloadArquivo
                    key={indiceBotao}
                    className={`${className} w-min`}
                    chave={arq.nomeGravado}
                    nome={arq.nomeOriginal}
                    label={arq.nomeOriginal}
                  />
                )
              })
            }
          </div>
        )
      }

    }
  }

  return (
    <Layout
      titulo={formataTituloOcorrencia(null, null, ocorrencia)}
      icone={IconeExclamacao()}
    >

      <div className={`
          flex flex-row w-full mt-2 px-2 
          bg-gray-50 border items-center
          rounded-t-sm 
      `}>
        {IconeDocumento()}
        <Subtitulo className='w-full ml-2 mt-2'>Detalhamento inicial da ocorrência Nº {ocorrencia ? ocorrencia.sequencia : ''}</Subtitulo>
        <BotaoVoltar
          onClick={() => router.back()}
        />
        <BotaoProximo
          onClick={async () => {
            const { pendencias } = await axiosGet(endpoints.OCORRENCIA, { email: usuario.email })
            if (!pendencias.length) {
              alerta('Não há mais ocorrências')
              return
            }

            let indiceAtual = -1

            pendencias.map((item, indice) => {
              if (item.sequencia === ocorrencia.sequencia) {
                indiceAtual = indice
              }
            })

            if (indiceAtual === -1) {
              router.push(`/ocorrencias/editar-oc?sequencia=${pendencias[0].sequencia}`)
            } else {
              if (indiceAtual === (pendencias.length - 1)) {
                alerta('Não há mais ocorrências')
                return
              } else {
                router.push(`/ocorrencias/editar-oc?sequencia=${pendencias[indiceAtual + 1].sequencia}`)
              }
            }
          }}
        />
      </div>

      {!tipoOcorrencia ? <Subtitulo>Ocorrência não localizada</Subtitulo> : null}

      <If exibir={ocorrencia}>
        <div className='grid grid-cols-6 gap-2 w-full p-2 border-b border-l border-r'>
          {tipoOcorrencia ? tipoOcorrencia.campos.map((valor, indice) => getComponenteCampo(valor.nome, indice)) : null}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-6 gap-2 w-full '>
          <TextInput
            className='md:col-span-2'
            label='Criado por'
            value={ocorrencia?.criadoPor}
            readOnly
          />
          <TextInput
            className='md:col-span-2'
            label='Responsável atual'
            value={ocorrencia?.responsavelAtual}
            readOnly
          />
          <TextInput
            className='md:col-span-2'
            label='Status'
            value={ocorrencia?.status}
            readOnly
          />
        </div>

        <If exibir={
          (ocorrencia && !ocorrencia.migrado &&
            usuario && ocorrencia.responsavelAtual &&
            ocorrencia.responsavelAtual.toUpperCase() == usuario.email.toUpperCase()
          ) ||
          perfil?.areaPagamentos ||
          perfil?.admin
        }>
          <FormInclusaoApontamento
            ocorrencia={ocorrencia}
            className='mt-2 border-t border-b'
            inclusao={incluirApontamento}
          />
        </If>

        <FormApontamentos
          className='mt-2'
          ocorrencia={ocorrencia}
          atualizar={atualizar}
        />
      </If>

    </Layout>
  )
}
