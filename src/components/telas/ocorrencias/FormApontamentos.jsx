import { useEffect, useState } from 'react'
import useAppData from '../../../data/hook/useAppData'
import { formataDataHora } from '../../../utils/DateUtils'
import Titulo from '../../labels/Titulo'
import { IconeDocumento, IconeSetaCima } from '../../icons'
import If from '../../utils/If'
import endpoints from '../../../data/endpoints.json'
import BotaoDownloadArquivo from '../../botoes/BotaoDownloadArquivo'

export default function Apontamentos({ocorrencia, className='', atualizar=null}) {

    const { axiosGet } = useAppData()
    const [apontamentos, setApontamentos] = useState([])

    useEffect(() => {
        if (ocorrencia) {
            axiosGet(endpoints.APONTAMENTO, { sequencia: ocorrencia.sequencia }).then(res => {      
                setApontamentos(res)
            })
        } else {
            setApontamentos([])
        }

        return () => {
            setApontamentos(null)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ocorrencia, atualizar])

    const getLinhaApontamentoSimples = (apontamento, indice) => {
        return (
            <div key={indice}>
                {indice == 0 ? null : <div className='my-2 w-full flex flex-col items-center'>{IconeSetaCima(5)}</div>}
                <div className={`
                    grid grid-cols-1 gap-2 md:grid-cols-3
                    w-full border p-2 ${indice % 2 == 0 ? 'bg-blue-50' : ''}
                `}>
                    <div className='flex flex-col flex-wrap'>
                        <span className='font-bold text-sm'>Data/Hora</span>
                        <span className='text-sm'>{formataDataHora(apontamento.dataHoraRegistro)}</span>
                    </div>
                    <div className='flex flex-col'>
                        <div className='font-bold text-sm'>Criado por</div>
                        <div className='text-sm'>{apontamento.criadoPor}</div>
                    </div>
                    <div className='flex flex-col  flex-wrap'>
                        <span className='font-bold text-sm'>Status informado</span>
                        <span className='text-sm'>{apontamento.status}</span>                   
                    </div>
                    
                    <div className='md:col-span-3'>
                        <div key={indice} className={`flex flex-row flex-wrap ${className}`}>
                            {
                                apontamento?.arquivos?.map((arq, indiceBotao) => {
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
                    </div>
                    
                    <div className='flex flex-col flex-wrap md:col-span-3'>
                        <span className='font-bold text-sm'>Resposta</span>
                        <span className='text-sm'>{apontamento.resposta}</span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <If exibir={apontamentos && apontamentos.length > 0}>
            <div className={`
                ${className}
            `}>
                <div className='flex w-full mb-2'>
                    {IconeDocumento(6)}
                    <Titulo className='ml-2'>
                        Apontamentos registrados para a ocorrência
                    </Titulo>
                </div>
                {
                    apontamentos?.map((apontamento, indice) => {
                        return getLinhaApontamentoSimples(apontamento, indice)
                    })
                }
            </div>
        </If>
    )

}