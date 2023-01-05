import TextAreaInput from '../../inputs/TextAreaInput'
import SelectStatusOcorrencia from './SelectStatusOcorrencia'
import StatusOcorrencia from '../../../data/status-ocorrencia.json'
import BotaoGravar from '../../botoes/BotaoGravar'
import BotaoOk from '../../botoes/BotaoOk'
import Subtitulo from '../../labels/Subtitulo'
import { IconeDiretorio, IconeEdit, IconeSoma, IconeUsuarios, IconeX } from '../../icons'
import { useEffect, useReducer, useState } from 'react'
import useAppData from '../../../data/hook/useAppData'
import { validaApontamento } from '../../../utils/funcoes-ocorrencias'
import If from '../../utils/If'
import SelectResponsavel from '../responsavel/SelectResponsavel'
import SelectRespostaAutomatica from './SelectRespostaAutomatica'
import { useDropzone } from 'react-dropzone'


export default function FormInclusaoApontamento({ ocorrencia=null, className, inclusao }) {
    const apontamentoVazio = {
        status: '',
        resposta: ''
    }

    const { pergunta, alerta } = useAppData()
    const [estado, dispatch] = useReducer(reducer, apontamentoVazio)
    const [esconderStatus, setEsconderStatus] = useState(false)
    const [novoResponsavel, setNovoResponsavel] = useState('')
    const [respostaAutomatica, setRespostaAutomatica] = useState('')
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone()
    const [arquivos, setArquivos] = useState([])

    function reducer(estado, valor) {
        if (valor === 'clear') {
            return apontamentoVazio
        } else {
            return {...estado, ...valor}
        }
    }    

    const [statusPermitidos, setStatusPermitidos] = useState([])

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
    
    useEffect(() => {
        setEsconderStatus(false)

        if (ocorrencia) {
            if (ocorrencia.status === StatusOcorrencia.NOVA) {
                setStatusPermitidos([
                    StatusOcorrencia.EM_ANALISE, StatusOcorrencia.ENCERRADA,
                    StatusOcorrencia.SOLICITADO_INFORMACOES_ADICIONAIS])
            } else if (ocorrencia.status === StatusOcorrencia.EM_ANALISE) {
                setStatusPermitidos([
                    StatusOcorrencia.ENCERRADA, 
                    StatusOcorrencia.DADOS_ATUALIZADOS, 
                    StatusOcorrencia.SOLICITADO_INFORMACOES_ADICIONAIS
                ])
            } else if (ocorrencia.status === StatusOcorrencia.SOLICITADO_INFORMACOES_ADICIONAIS) {
                setEsconderStatus(true)
                dispatch({status: StatusOcorrencia.INFORMACOES_FORNECIDAS})
                setStatusPermitidos([ 
                    StatusOcorrencia.INFORMACOES_FORNECIDAS
                ])
            } else if (ocorrencia.status === StatusOcorrencia.DADOS_ATUALIZADOS) {
                setStatusPermitidos([ 
                    StatusOcorrencia.DADOS_ATUALIZADOS,
                    StatusOcorrencia.REDISTRIBUIDO,
                    StatusOcorrencia.ENCERRADA,
                    StatusOcorrencia.SOLICITADO_INFORMACOES_ADICIONAIS
                ])
            } else if (ocorrencia.status === StatusOcorrencia.ENCERRADA) {
                setStatusPermitidos([ 
                    StatusOcorrencia.REABERTA
                ])
            } else if (ocorrencia.status === StatusOcorrencia.REABERTA) {                
                setStatusPermitidos([ 
                    StatusOcorrencia.EM_ANALISE,
                    StatusOcorrencia.ENCERRADA,
                    StatusOcorrencia.SOLICITADO_INFORMACOES_ADICIONAIS
                ])
            } else if (ocorrencia.status === StatusOcorrencia.REDISTRIBUIDO) {                
                setStatusPermitidos([ 
                    StatusOcorrencia.EM_ANALISE,
                    StatusOcorrencia.ENCERRADA,
                    StatusOcorrencia.SOLICITADO_INFORMACOES_ADICIONAIS
                ])
            } else if (ocorrencia.status === StatusOcorrencia.INFORMACOES_FORNECIDAS) {
                setStatusPermitidos([ 
                    StatusOcorrencia.EM_ANALISE,
                    StatusOcorrencia.ENCERRADA,
                    StatusOcorrencia.SOLICITADO_INFORMACOES_ADICIONAIS
                ])
            }
        } else {
            setStatusPermitidos([])
        }
    }, [ocorrencia])

    return (
        <>
            <div className={`
                flex flex-col w-full
                py-2 ${className}
            `}>
                <div className='flex w-full mt-2'>
                    {IconeEdit()}
                    <Subtitulo className='ml-2'>
                        Atualize os dados da ocorrência aqui
                    </Subtitulo>
                </div>
                
                <If exibir={!esconderStatus}>

                    <SelectStatusOcorrencia
                        className='w-full'
                        value={estado.status}
                        itensPermitidos={statusPermitidos}
                        onChange={valor => {
                            dispatch({status: valor})
                        }}
                    />

                    <div className='w-full flex flex-col mt-4'>
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
                </If>
                
                <TextAreaInput
                    className='w-full'
                    label='Resposta'
                    value={estado.resposta}
                    onChange={valor => {
                        dispatch({resposta: valor})
                    }}
                />

                <BotaoGravar 
                    className='self-end' 
                    onClick={async () => {
                        const mensagem = validaApontamento(estado)

                        if (mensagem) {
                            alerta(mensagem)
                            return 
                        }

                        pergunta('A ocorrência será atualizada com os dados digitados. Confirma?', async () => {
                            if (inclusao) {
                                await inclusao(estado, arquivos)
                                dispatch('clear')
                            }
                        })
                    }}
                />
            </div>
            <If exibir={!esconderStatus}>
                <div className='mt-2 flex flex-col'>
                    <div className='flex w-full mt-2'>
                        {IconeUsuarios()}                        
                        <Subtitulo className='ml-2'>
                            Atribuir a ocorrência para outro usuário
                        </Subtitulo>
                    </div>
                    <div className='flex flex-row w-full items-center'>
                        <SelectResponsavel 
                            className='w-full'
                            value={novoResponsavel}
                            onChange={setNovoResponsavel}   
                        />

                        <BotaoOk 
                            className='mt-4 ml-2'                            
                            onClick={() => {
                                pergunta('A ocorrência será atribuída para um novo responsável. Confirma?', async () => {
                                    if (inclusao) {
                                        await inclusao({
                                            status: StatusOcorrencia.REDISTRIBUIDO, 
                                            resposta: `REDISTRIBUÍDO PARA ${novoResponsavel}`,
                                            novoResponsavel
                                        })
                                        
                                        dispatch('clear')
                                    }
                                })

                            }}
                        />
                    </div>
                </div>
            </If>
        </>
    )
}