import { useEffect, useState, useReducer, useRef } from "react"
import Layout from '../../../components/template/Layout'
import _ from 'lodash'
import { IconeArquivo, IconeDiretorio, IconeSoma, IconeX } from '../../../components/icons'
import BotaoGravar from '../../../components/botoes/BotaoGravar'
import PainelErro from '../../../components/utils/PainelErro'
import useAppData from '../../../data/hook/useAppData'
import TextInput from '../../../components/inputs/TextInput'
import CnpjInput from '../../../components/inputs/CnpjInput'
import DateInput from '../../../components/inputs/DateInput'
import MesAnoInput from '../../../components/inputs/MesAnoInput'
import TextAreaInput from '../../../components/inputs/TextAreaInput'
import SelectInput from '../../../components/inputs/SelectInput'
import tipoOcorrencias from '../../../data/tipos-ocorrencias.json'
import camposOcorrencias from '../../../data/campos-ocorrencia.json'
import { formataTituloOcorrencia } from '../../../components/telas/ocorrencias/TituloOcorrencia'
import { validaCamposOcorrencia } from '../../../utils/funcoes-ocorrencias'
import CampoPesquisaEmpresa from "../../../components/telas/empresa/CampoPesquisaEmpresa"
import PainelMensagemOcorrencia from '../../../components/telas/ocorrencias/PainelMensagemOcorrencia'
import { useRouter } from 'next/router'
import If from "../../../components/utils/If"
import CampoEmpresas from '../../../components/telas/ocorrencias/CampoEmpresas'
import log from '../../../utils/app-log'
import endpoints from '../../../data/endpoints.json'
import { useDropzone } from 'react-dropzone'
import DoubleInput from '../../../components/inputs/DoubleInput'
import SelectColecao from '../../../components/inputs/SelectColecao'
import CheckboxInput from '../../../components/inputs/CheckboxInput'
import IntegerInput from '../../../components/inputs/IntegerInput'
import Subtitulo from '../../../components/labels/Subtitulo'

export default function Ocorrencia() {
    const router = useRouter()
    
    const [tipoOcorrencia, setTipoOcorrencia] = useState(null)
    const [ocorrenciaVazia, setOcorrenciaVazia] = useState(null)
    const [ mensagemErro, setMensagemErro ] = useState('')
    const { exibirModal, pergunta, uploadArquivoCadastro } = useAppData()
    const [estado, dispatch] = useReducer(reducer, {})
    const { axiosPost, alerta } = useAppData()
    const [ item, setItem ] = useState(0)
    const [ subitem, setSubitem ] = useState(0)
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone()
    const [arquivos, setArquivos] = useState([])

    useEffect(() => {
        const { tipo } = router.query

        if (tipo) {
            const [ i, s ] = tipo.split('.').map(i => +i)
            setItem(i)
            setSubitem(s)
            const novoTipo = tipoOcorrencias[i-1].itens[s-1]
            setTipoOcorrencia(novoTipo)

            const novaOcorrenciaVazia = {
                tipoPrincipal: tipoOcorrencias[i-1].codigo,
                descricaoTipoPrincipal: tipoOcorrencias[i-1].descricao,
                tipoOcorrencia: novoTipo ? novoTipo.codigo : '',
                descricaoOcorrencia: novoTipo ? novoTipo.descricao : '',
                dataEncerramento: null,
                status: 'NOVA'        
            }

            novoTipo?.campos.forEach(item => novaOcorrenciaVazia[item.nome] = '')
            setOcorrenciaVazia(novaOcorrenciaVazia)
            dispatch({limpar:true, dados: novaOcorrenciaVazia})
        }

        return () => {
            setItem(null)
            setSubitem(null)
            setTipoOcorrencia(null)
            setOcorrenciaVazia(null)
        }
    }, [router.query])

    useEffect(() => {
        let mensagemAlerta = false

        if (acceptedFiles?.length) {
            const arquivosProcessados = acceptedFiles.filter(file => {
                if (file?.size > 5e6) {
                    mensagemAlerta = true
                    return false
                } else {
                    return true
                }
            }).map(file => {                
                return { 
                    arquivo: file,
                    nome: file.name
                }
            })

            if (mensagemAlerta) {
                alerta('1 ou mais arquivos não foram incluídos, pois excederam o tamanho máximo de 5MB!')
            }
            
            setArquivos([...arquivos, ...arquivosProcessados])
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [acceptedFiles])

    function reducer(estado, valor) {
        if (valor.limpar) {
            return valor.dados
        }

        const retorno = {...estado, ...valor}
        return retorno
    }

    const getComponenteCampo = (nome, indice) => {
        const configTitulo = camposOcorrencias[nome]
        const config = tipoOcorrencia.campos.filter(valor => valor.nome === nome).pop()        
        const className = config.span ?  `col-span-6 md:col-span-${config.span}` : ''
        
        if (/*!configTitulo || */!config) {
            log('desenv', `Não foi possível encontrar configurações para o campo ${nome}`)
            log('desenv', `config = ${JSON.stringify(config)}`)
            log('desenv', `configTitulo = ${JSON.stringify(configTitulo)}`)
            return null
        } else {
            if (!configTitulo) {
                return (
                    <Subtitulo
                        className={`${className} bg-gray-100 text-center py-2 rounded-md`}
                        key={indice}
                    >
                        {`${config.titulo}`}
                    </Subtitulo>
                )
            } else if (configTitulo.tipo === 'cnpj') {
                return (
                    <CnpjInput
                        className={className}
                        key={indice}
                        label={configTitulo.titulo}
                        value={estado ? estado[nome] : ''}
                        required={config.required}
                        onChange={valor => {
                            const obj = {}
                            obj[nome] = valor
                            dispatch(obj)
                        }}                    
                    />
                )
            } else if (configTitulo.tipo === 'string') {
                return (
                    <TextInput
                        className={className}
                        key={indice}
                        label={configTitulo.titulo}
                        value={estado ? estado[nome] : ''}
                        required={config.required}
                        onChange={valor => {
                            const obj = {}
                            obj[nome] = valor
                            dispatch(obj)
                        }}                    
                    />
                )
            } else if (configTitulo.tipo === 'double') {
                return (
                    <DoubleInput
                        className={className}
                        key={indice}
                        label={configTitulo.titulo}
                        value={estado ? estado[nome] : ''}
                        required={config.required}
                        onChange={valor => {
                            const obj = {}
                            obj[nome] = valor
                            dispatch(obj)
                        }}                    
                    />
                )
            } else if (configTitulo.tipo === 'integer') {
                return (
                    <IntegerInput
                        className={className}
                        key={indice}
                        label={configTitulo.titulo}
                        value={estado ? estado[nome] : ''}
                        required={config.required}
                        onChange={valor => {
                            const obj = {}
                            obj[nome] = valor
                            dispatch(obj)
                        }}                    
                    />
                )
            } else if (configTitulo.tipo === 'textarea') {
                return (
                    <TextAreaInput 
                        className={className}
                        key={indice}
                        label={configTitulo.titulo}
                        value={estado ? estado[nome] : ''}
                        required={config.required}
                        onChange={valor => {
                            const obj = {}
                            obj[nome] = valor
                            dispatch(obj)
                        }}                    
                    />
                )
            } else if (configTitulo.tipo === 'empresa') {
                return (
                    <CampoPesquisaEmpresa 
                        key={indice}
                        className={className}
                        required={config.required}
                        value={estado ? estado[nome] : ''}
                        onChange={valor => {
                            const obj = {}

                            if (valor) {
                                obj[nome] = valor
                            } else {
                                obj[nome] = ''
                            }

                            dispatch(obj)
                        }}
                    />
                )
            } else if (configTitulo.tipo === 'date') {
                return (
                    <DateInput 
                        className={className}
                        key={indice}
                        label={configTitulo.titulo}
                        value={estado ? estado[nome] : ''}
                        required={config.required}
                        onChange={valor => {
                            const obj = {}
                            obj[nome] = valor
                            dispatch(obj)
                        }}
                    />
                )
            } else if (configTitulo.tipo === 'competencia') {
                return (
                    <MesAnoInput 
                        className={className}
                        key={indice}
                        label={configTitulo.titulo}
                        value={estado ? estado[nome] : ''}
                        required={config.required}
                        onChange={valor => {
                            const obj = {}
                            obj[nome] = valor
                            dispatch(obj)
                        }}
                    />
                )
            } else if (configTitulo.tipo === 'checkbox') {
                return (
                    <CheckboxInput 
                        className={`${className} md:mt-4`}
                        key={indice}
                        label={configTitulo.titulo}
                        value={estado ? estado[nome] : false}
                        required={config.required}
                        onChange={valor => {
                            const obj = {}
                            obj[nome] = valor
                            dispatch(obj)
                        }}
                    />
                )
            } else if (configTitulo.tipo === 'empresas') {
                return (
                    <CampoEmpresas 
                        className={className}
                        key={indice}
                        label={configTitulo.titulo}
                        onChange={valor => {
                            const obj = {}
                            obj[nome] = valor
                            dispatch(obj)
                        }}       
                    />
                )
            } else if (configTitulo.tipo === 'combo') {
                return (
                    <SelectInput 
                        dados={configTitulo.itens.map(i => {
                            return {descricao: i}
                        })} 
                        campoLabel='descricao'
                        className={className}
                        key={indice}
                        label={configTitulo.titulo}
                        textoItem={estado ? estado[nome] : ''}
                        required={config.required}
                        onChange={valor => {
                            const obj = {}
                            obj[nome] = valor ? valor.descricao : ''
                            dispatch(obj)
                        }}
                    />
                )
            } else if (configTitulo.tipo === 'banco') {
                return (
                    <SelectColecao
                        endpoint={endpoints.BANCO}
                        camposExibicao={[{"nome": "codigo"}, {"nome": "nome"}]}
                        className={className}
                        key={indice}
                        label={configTitulo.titulo}
                        required={config.required}
                        retirarCampos={true}
                        onChange={valor => {
                            const obj = {}
                            obj[nome] = valor
                            dispatch(obj)
                        }}
                    />
                )
            } else if (configTitulo.tipo === 'upload') {                
                return (
                    <div 
                        key={indice}
                        className={`${className}`}
                    >
                        <div className='w-full flex flex-col'>
                            <div {...getRootProps({className: 'dropzone'})} className={`
                                w-full flex flex-col flex-wrap p-6 border-dashed  border-2
                                rounded bg-blue-50 items-center justify-center
                                cursor-pointer
                            `}>
                                <div className='flex items-center'>{IconeDiretorio(10)}{IconeSoma(5)}</div>
                                <input {...getInputProps()}/>
                                <p className='text-lg'>{'Arraste os arquivos para esta área ou clique em qualquer local para selecioná-los'}</p>
                            </div> 

                            <div className='flex flex-row flex-wrap mt-2'>
                                {
                                    arquivos.map((item, indiceArquivo) => {
                                        return (
                                            <div 
                                                className={`
                                                    flex flex-row rounded-md p-2
                                                    border-dotted border-2
                                                `}
                                                key={indiceArquivo}
                                            >
                                                <div className='text-sm font-semibold flex-grow'>{`${item.nome}`}</div>
                                                <div 
                                                    className={`
                                                        font-bold text-red-500 ml-2
                                                        cursor-pointer
                                                    `}
                                                    onClick={() => {
                                                        setArquivos(arquivos.filter(arq => arq !== item ))
                                                    }}                                            
                                                >
                                                    {IconeX()}
                                                </div>
                                            </div>
                                        )
                                    }, [])
                                }
                            </div>
                        </div>
                    </div>
                )
            } 

        }
    }

    return (
        <Layout 
            titulo={formataTituloOcorrencia(item, subitem)}
            icone={IconeArquivo()}> 

            <PainelErro 
                titulo={'Erro a gravar o registro'} 
                mensagemErro={mensagemErro} 
                onChange={() => setMensagemErro('')}
            />

            <If exibir={tipoOcorrencia}>
                <PainelMensagemOcorrencia tipoOcorrencia={tipoOcorrencia} />
            </If>
            
            <div>
                <div className=' grid grid-cols-6 gap-2 w-full'>
                    {tipoOcorrencia ? tipoOcorrencia.campos.map((valor, indice) => getComponenteCampo(valor.nome, indice)) : null}
                </div>

                <If exibir={tipoOcorrencia}>
                    <div className='flex flex-col w-full mt-6 items-end mb-2'>
                        <BotaoGravar onClick={async () => {
                            estado['upload'] = arquivos.length
                            const camposNaoValidados = validaCamposOcorrencia(estado)

                            if (camposNaoValidados.length > 0) {
                                const msgAlerta = `Erros/Campos não preenchidos: ${camposNaoValidados.join(', ')}`
                                setMensagemErro(msgAlerta)
                                window.scrollTo(0,0)
                            } else {
                                const gravar = async () => {                                    
                                    try {
                                        await axiosPost(endpoints.OCORRENCIA, estado)
                                        const retorno = await uploadArquivoCadastro(endpoints.UPLOAD_OCORRENCIA, arquivos?.map(item => item.arquivo), estado)
                                        setMensagemErro('')
                                        exibirModal('Ocorrência criada', retorno)
                                        dispatch(ocorrenciaVazia)                                        
                                        setArquivos([])
                                    } catch (error) {
                                        setMensagemErro(error)
                                    }
                                }

                                pergunta('A ocorrência será gravada e atribuída para o responsável da área. Confirma?', gravar)
                            }
                        }} />
                    </div>
                </If>
            </div>
        </Layout>
    )

}