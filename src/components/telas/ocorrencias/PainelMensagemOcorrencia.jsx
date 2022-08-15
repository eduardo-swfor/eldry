import { useEffect, useState } from 'react'
import useAppData from '../../../data/hook/useAppData'
import Subtitulo from '../../labels/Subtitulo'
import If from '../../utils/If'
import endpoints from '../../../data/endpoints.json'


export default function PainelMensagemOcorrencia({tipoOcorrencia}) {

    const { listarColecao } = useAppData()
    const [ textoSla, setTextoSla ] = useState('')
    const [ textoObservacao, setTextoObservacao ] = useState('')

    useEffect(() => {
        listarColecao(endpoints.SLA, { codigo: tipoOcorrencia.codigo }).then(retorno => {
            setTextoSla(`O SLA máximo de resposta para este tipo de ocorrência é de ${retorno.sla} dias úteis`)
            setTextoObservacao(retorno.textoObservacao)        
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tipoOcorrencia])
    
    return (
        <>
            <div className={`
                flex rounded bg-gray-100 mb-3 p-2
                w-full font-bold text-red-500
            `}>
                {textoSla}
            </div>

            <If exibir={textoObservacao}>
                <div className={`
                    flex rounded mb-2 px-2 py-3 w-full 
                    font-bold border
                `}>
                    {textoObservacao}
                </div>
            </If>

            <div className='flex w-full border-b content-end pt-2 pb-2'>
                <Subtitulo className='flex-grow'>{tipoOcorrencia.descricao}</Subtitulo>
            </div>
        </>
    )
}