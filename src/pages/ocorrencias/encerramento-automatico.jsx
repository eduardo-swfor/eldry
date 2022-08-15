import useAppData from '../../data/hook/useAppData'
import Layout from '../../components/template/Layout'
import TabelaDados from '../../components/tabelas/TabelaDados'
import BotaoGravar from '../../components/botoes/BotaoGravar'
import { useState, useEffect } from 'react'
import { IconeCasa, IconeExclamacao } from '../../components/icons'
import useAuth from '../../data/hook/useAuth'
import CheckboxInput from '../../components/inputs/CheckboxInput'
import endpoints from '../../data/endpoints.json'
import axios from '../../services/axios'
import Titulo from '../../components/labels/Titulo'

export default function EncerramentoAutomatico() {
    const [dados, setDados] = useState([])
    const [selecionados, setSelecionados] = useState([])
    const [mensagem, setMensagem] = useState('')
    const { usuario } = useAuth()
    const { executaComLoading, exibirToast, pergunta } = useAppData()

    useEffect(() => {
        if (usuario?.email) {
            axios.get(endpoints.OCORRENCIA, { obj: { email: usuario.email } }).then(retorno => {
                setDados(retorno.data.pendencias)
            })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usuario])

    const jsxBotoes = p => {
        return (
            <div className='flex'>
                <CheckboxInput
                    value={selecionados.find(o => o._id === p._id)}
                    onChange={valor => {                        
                        setSelecionados([...selecionados.filter(o => o._id !== p._id), p].filter(o => !valor && o._id === p._id ? false : true))
                    }}
                />
            </div>
        )
    }

    return (
        <Layout titulo='Encerramento automático' icone={IconeCasa()}>
            {
                mensagem ? 
                    <Titulo className='text-red-500'>{mensagem}</Titulo> :
                    null
            }
            <TabelaDados
                className='mt-4 w-full max-h-96'
                propriedades={[
                    { nome: 'acoes', tipo: 'jsx', titulo: 'Ações', jsx: jsxBotoes },
                    { nome: 'status', tipo: 'string', titulo: 'Status' },
                    { nome: 'sequencia', tipo: 'string', titulo: 'Sequência' },
                    { nome: 'tipoOcorrencia', tipo: 'string', titulo: 'Tipo' },
                    { nome: 'descricaoOcorrencia', tipo: 'string', titulo: 'Descrição' },
                    { nome: 'dataUltimaAtualizacao', tipo: 'date', titulo: 'Atualizado em' },
                ]}
                titulo='Minhas pendências'
                dados={dados}
                icone={IconeExclamacao(5)}
            />

            <div className='flex flex-row w-full'>
                <CheckboxInput 
                    label='Marcar/Desmarcar todos'
                    onChange={valor => {
                        setSelecionados(dados.filter(o => valor))
                    }}                    
                />
                <div className='flex flex-col flex-grow items-end'>
                    <BotaoGravar
                        label='Encerrar selecionados'
                        onClick={() => {
                            const ids = selecionados.map(o => o._id.toString())

                            if (ids.length) {
                                pergunta('Confirma o encerramento das ocorrências selecionadas?', () => {
                                    executaComLoading(async() => {
                                        const retorno = await axios.post(endpoints.ENCERRA_OCORRENCIAS, { ids })
                                        setSelecionados([])
                                        setDados(retorno.data)
                                    })
                                })                       
                            } else {
                                exibirToast('Selecione uma ou mais ocorrências', 'a')
                            }
                        }}
                    />
                </div>
            </div>
        </Layout>
    )
}